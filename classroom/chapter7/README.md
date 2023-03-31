---
sidebar_label: WebSocket实现消息广播功能
sidebar_position: 12
---

# WebSocket实现消息广播功能

## 学习目标

* 实现消息即时发送
* 实现聊天室功能
* 使用BullMQ异步存储消息
* 离线消息读取与读取状态设置
* 管理员,发送者与接受者三种身份对消息的CRUD操作

## 流程图
![](https://img.pincman.com/media202209182006519.png)

### 预装类库

在开始编码之前请安装以下类库

```shell
~ pnpm add @nestjs/websockets @nestjs/platform-ws ws
~ pnpm add @types/ws -D
```

## 编码

### 常量

定义一个用于设置消息接收者操作类型的枚举和一个用于保存消息队列名称操作的常量

```typescript
// src/modules/user/constants.ts
export const SAVE_MESSAGE_QUEUE = 'send-message-queue';
export enum RecevierActionType {
    READED = 'readed',
    DELETE = 'delete',
}
```

### 模型

`MessageEntity`用于存储消息

- `sender`为消息发送者
- `recevies` 为消息与接收者之间的关联表
- `recevier` 是一个虚拟字段用于在接收者读取消息时读取其自身的用户数据

```typescript
// src/modules/user/entities/message.entity.ts
@Entity('user_messages')
export class MessageEntity extends BaseEntity {
    ...
    @ManyToOne((type) => UserEntity, (user) => user.sends, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    sender!: UserEntity;

    @OneToMany((type) => MessagerecevieEntity, (recevier) => recevier.message)
    recevies!: MessagerecevieEntity[];

    recevier: MessagerecevieEntity;
}
```

`MessagerecevieEntity`是`UserEnity`和`MessageEntity`的中间表.由于一个消息被读取的状态是需要中间表来实现的，所以我们添加这个中间模型来实现消息和接收者的多对多关联

```typescript
// src/modules/user/entities/recevie.entity.ts
@Entity('users_recevies')
export class MessagerecevieEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ comment: '是否已读', default: false })
    readed?: boolean;

    @ManyToOne(() => MessageEntity, (message) => message.recevies)
    message!: MessageEntity;

    @ManyToOne(() => UserEntity, (recevier) => recevier.messages)
    recevier!: UserEntity;
}

```

最后在`UserEntity`中加上关联

```typescript
// src/modules/user/entities/user.entity.ts  
  @OneToMany((type) => MessageEntity, (message) => message.sender, {
        cascade: true,
    })
    sends!: MessageEntity[];

    @OneToMany((type) => MessagerecevieEntity, (message) => message.recevier)
    messages!: MessagerecevieEntity[];
```

### 存储类

分别为消息模型和接收者中间表模型添加两个存储类

```typescript
// src/modules/user/repositories/message.repository.ts
@CustomRepository(MessageEntity)
export class MessageRepository extends BaseRepository<MessageEntity> {
    protected qbName = 'message';

    buildBaseQuery() {
        return this.createQueryBuilder(this.qbName).orderBy(`${this.qbName}.createdAt`, 'DESC');
    }
}

// src/modules/user/repositories/recevie.repository.ts
@CustomRepository(MessagerecevieEntity)
export class RecevieRepository extends BaseRepository<MessagerecevieEntity> {
    protected qbName = 'recevie';
}
```

### 类型

添加一个用于队列存储消息的数据类型

```typescript
// src/modules/user/types.ts
export type SaveMessageQueueJob = Pick<ClassToPlain<MessageEntity>, 'title' | 'body' | 'type'> & {
    receviers: string[];
    sender: string;
};
```

### 验证管道
WebSockets的验证管道大体上与前面我们自定义的全局管道一样，只是抛出的异常不同，所以我们只需继承默认的`AppPipe`

```typescript
export class WsPipe extends AppPipe {
    async transform(value: any, metadata: ArgumentMetadata) {
        try {
            return await super.transform(value, metadata);
        } catch (err: any) {
            const error = err.response ?? err;
            throw new WsException(error);
        }
    }
}
```

### 异常处理过滤器

对于WS抛出的异常定义一个专用的过滤器来处理，在捕获ws异常时我们发送一个异常事件的消息

> 异常事件等等在网关中定义

```typescript
// src/modules/core/app/ws.filter.ts
@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        super.catch(exception, host);
    }

    handleError(client: any, exception: any) {
        const result = super.handleError(client, exception);
        if (client instanceof WebSocket) {
            ...
            client.send(JSON.stringify({ event: 'exception', data: message }));
        }
        return result;
    }

    handleUnknownError(exception: any, client: any) {
       ...
    }
}
```

### JWT守卫
同样地对于认证，我们需要单独为WS添加一个JWT守卫

```typescript
@Injectable()
export class JwtWsGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) {}

    /**
     * 守卫方法
     * @param context
     */
    async canActivate(context: ExecutionContext) {
        const { token } = context.switchToWs().getData() || {};
        if (!token) {
            throw new WsException('Missing access token');
        }
        // 判断token是否存在,如果不存在则认证失败
        const accessToken = await this.tokenService.checkAccessToken(token);
        if (!accessToken) throw new WsException('Access token incorrect');
        const user = await this.tokenService.verifyAccessToken(accessToken);
        return !isNil(user);
    }
}
```

### DTO
分别构建用于websockets发送消息的请求验证和消息数据查询与操作的请求验证的DTO类

文件位置: `src/modules/user/dtos/message.dto.ts`

- WSAuthDto: websocket认证请求验证
- WSMessageDto: websocket发送消息请求验证
- UpdateReceviersDto: 接受者更新信息状态的请求验证
- QueryOwnerMessageDto: 自己发送的消息列表查询请求验证
- QueryMessageDto: 消息管理查询请求验证
- QueryReciveMessageDto: 收到的消息查询请求验证

### 服务类
`MessageService`用于消息的存储操作，继承自`BaseService`，自带CRUD操作，具体有以下几个方法

> 因为数据存储操作前面已经讲的比较多这里就不重复讲解了

文件位置:`src/modules/user/services/message.service.ts`

- deleteSended: 发送者删除已发送的消息
- deleteSendeds: 发送者批量删除已发送的消息
- updateRecevie: 更改接收数据，删除消息接收者与消息的关联(即接收者删除该消息)/更改已读状态
- updateReceviesList: 批量更改接收数据，删除消息接收者与消息的关联(即接收者删除该消息)/更改已读状态
- updateReceviesPaginate: 批量更改接收数据，返回分页后的消息列表，删除消息接收者与消息的关联(即接收者删除该消息)/更改已读状态
- updateRecevies: 批量更改接收数据，删除消息接收者与消息的关联(即接收者删除该消息)/更改已读状态的具体处理
- 重载`buildItemQuery`与`buildListQuery`方法从而更改单项与列表的查询逻辑

### 异步存储队列
我们不可能在每次发送消息时都去同步把消息存储到数据库，这种操作十分影响性能，所以可以采用前面学过的MQ队列知识来异步存储消息

与前面异步发送短信和邮件的编写方式一样

1.注册队列

```typescript
// src/modules/user/user.module.ts
imports: [
    ...
    BullModule.registerQueue({
        name: SAVE_MESSAGE_QUEUE,
    }),
]
```

2.编写任务提供者

```typescript
// src/modules/user/queue/message.job.ts
@Injectable()
export class MessageJob {
    constructor(
        @InjectQueue(SAVE_MESSAGE_QUEUE) protected messageQueue: Queue,
        protected worker: MessageWorker,
    ) {
        this.worker.addWorker();
    }

    /**
     * 保存消息
     * @param params
     */
    async save(params: SaveMessageQueueJob) {
        try {
            await this.messageQueue.add('save-message', params);
        } catch (err) {
            throw new BadRequestException(err);
        }
        return { result: true };
    }
}

```

3.编写任务消费者

```typescript
// src/modules/user/queue/message.worker.ts
@Injectable()
export class MessageWorker {
    constructor(
        protected messageRepository: MessageRepository,
        protected userRepository: UserRepository,
        protected recevieRepostiroy: RecevieRepository,
    ) {}

    /**
     * 添加消费者
     */
    async addWorker() {
        return new Worker(
            SAVE_MESSAGE_QUEUE,
            async (job: Job<SaveMessageQueueJob>) => this.saveMessage(job),
            { concurrency: 10 },
        );
    }

    /**
     * 保存消息
     * @param job
     */
    protected async saveMessage(job: Job<SaveMessageQueueJob>) {
      ...
    }
}
```

### WebSocket网关
要使用WS，必须先加载适配器，Nestjs默认支持两种适配器，socket.io与ws库.因为ws库支持原生的websockets，所以性能上更具优势，所以我们使用ws的适配器

```typescript
// src/main.ts
async function bootstrap() {
    ...
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.listen(3100, '0.0.0.0');
}
bootstrap();
```

创建Websockets网关

```typescript
// src/modules/user/getways/ws.gateway.ts
@Injectable()
@WebSocketGateway()
@UseFilters(new WsExceptionFilter())
@UsePipes(
    new WsPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false },
    }),
)
export class MessageGateway {
    protected redisClient: Redis;

    protected _onliners: Onliner[] = [];

    constructor(
        protected redisService: RedisService,
        protected tokenService: TokenService,
        protected userService: UserService,
        protected messageJob: MessageJob,
    ) {
        this.redisClient = this.redisService.getClient();
    }

    get onLiners() {
        return this._onliners;
    }

    @WebSocketServer()
    server!: Server;

    /**
     * 用户上线
     * @param data
     * @param client
     */
    @UseGuards(JwtWsGuard)
    @SubscribeMessage('online')
    async onLine(
        @MessageBody() data: WSAuthDto,
        @ConnectedSocket() client: WebSocket,
    ): Promise<WsResponse<Record<string, any>>> {
        ...
    }

    /**
     * 用户下线
     * @param data
     * @param client
     */
    @UseGuards(JwtWsGuard)
    @SubscribeMessage('offline')
    async offLine(
        @MessageBody() data: WSAuthDto,
        @ConnectedSocket() client: WebSocket,
    ): Promise<WsResponse<Record<string, any>>> {
        ...
    }

    /**
     * 发送消息
     * @param data
     */
    @UseGuards(JwtWsGuard)
    @SubscribeMessage('message')
    async sendMessage(
        @MessageBody()
        data: WSMessageDto,
    ): Promise<any> {
        ...
    }

    /**
     * 消息异常
     * @param data
     */
    @SubscribeMessage('exception')
    sendException(
        @MessageBody()
        data: {
            status: string;
            message: any;
        },
    ): WsResponse<Record<string, any>> {
        ...
    }

    /**
     * 获取消息的发送者和接收者的模型对象
     * @param data
     */
    protected async getMessager(
        data: WSMessageDto,
    ): Promise<{ sender: UserEntity; receviers: UserEntity[] }> {
        ...
    }

    /**
     * 用户下线
     * @param param0
     */
    protected async offlineHandler({ token }: Onliner) {
       ...
    }

    /**
     * 获取当前在线用户
     */
    protected async getOnlineUsers() {
       ...
    }

    /**
     * 序列化用户模型对象
     * @param user
     */
    protected getUserInfo(user: UserEntity) {
        ...
    }
}
```

网关写好后别忘了放到提供者中注册，否则无法生效

```typescript
// src/modules/user/user.module.ts
@Module({
    providers: [
        ...strategies,
        ...dtos,
        ...services,
        ...guards,
        ...subscribers,
        ...queue,
        MessageGateway,
        ...
})
export class UserModule {}
```

### 消息控制器

消息控制器用于调用`MessageService`来管理消息的存储数据

文件位置: `src/modules/user/controllers/message.controller.ts`

接口如下

- `GET: messages/sendeds`: 读取发送的消息列表
- `PATCH: messages/readed`: 批量设置一些收到的消息为已读状态
- `DELETE: messages/sendeds/:item`: 发送者删除已发送的消息
- `DELETE: messages/sendeds`: 发送者批量删除已发送的消息
- `GET: messages/recevies`: 读取收到的消息列表
- `GET: messages/recevies/:item`: 读取收到的消息或设置为已读状态
- `Delete: messages/recevies/:item`: 接收者删除收到的消息
- `Delete: messages/recevies`: 接收者批量删除收到的消息