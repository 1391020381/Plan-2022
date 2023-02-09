import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersHttpDto } from './create-users-http.dto';

export class UpdateUsersHttpDto extends PartialType(CreateUsersHttpDto) {}
