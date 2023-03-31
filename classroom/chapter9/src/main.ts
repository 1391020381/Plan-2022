/*
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐│
 *  ││Esc│!1 │@2 │#3 │$4 │%5 │^6 │&7 │*8 │(9 │)0 │_- │+= │|\ │`~ ││
 *  │├───┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴───┤│
 *  ││ Tab │ Q │ W │ E │ R │ T │ Y │ U │ I │ O │ P │{[ │}] │ BS  ││
 *  │├─────┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴─────┤│
 *  ││ Ctrl │ A │ S │ D │ F │ G │ H │ J │ K │ L │: ;│" '│ Enter  ││
 *  │├──────┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴────┬───┤│
 *  ││ Shift  │ Z │ X │ C │ V │ B │ N │ M │< ,│> .│? /│Shift │Fn ││
 *  │└─────┬──┴┬──┴──┬┴───┴───┴───┴───┴───┴──┬┴───┴┬──┴┬─────┴───┘│
 *  │      │Fn │ Alt │         Space         │ Alt │Win│   HHKB   │
 *  │      └───┴─────┴───────────────────────┴─────┴───┘          │
 *  └─────────────────────────────────────────────────────────────┘
 *
 * 🐳 pincman   : pincman
 * 🕰 Created_At: 2022-08-17 14:48:32
 * ✍️ Last_Editors: pincman
 * ⌛️ Updated_At: 2022-12-02 18:48:57
 * 📃 FilePath  : /src/main.ts
 * 🔥 Description: 3R教室(https://pincman.com/classroom)提供TS全栈开发在线培训及远程工作求职指导
 * 🧊 Homepage  : https://pincman.com
 * 📮 Email     : pincman@qq.com
 * 🐱 Github    : https://github.com/nestjs/nestjs
 * 🐧 QQ        : 1849600177
 * 💬 微信        : yjosscom
 * 👥 QQ群       : 455820533
 * ✨ Copyright (c) 2022 by pincman.com, All Rights Reserved.
 */

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { WsAdapter } from '@nestjs/platform-ws';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        logger: ['error', 'warn'],
    });
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useWebSocketAdapter(new WsAdapter(app));
    app.setGlobalPrefix('api');
    // eslint-disable-next-line global-require
    app.register(require('@fastify/multipart'), {
        attachFieldsToBody: true,
    });
    await app.listen(3100, '0.0.0.0');
}
bootstrap();
