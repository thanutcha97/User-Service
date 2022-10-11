import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserInterface } from './interface/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'user_create' })
  create(data: UserInterface) {
    // console.log(data.username);
    return this.usersService.userCreate(data);
  }

  @MessagePattern({ cmd: 'get_users' })
  getUsers() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'find_username' })
  findByUsername(username: string) {
    return this.usersService.findByUsername(username);
  }

  @MessagePattern({ cmd: 'get_new_users' })
  getnewUsers() {
    return this.usersService.newUsers();
  }

  @MessagePattern({ cmd: 'update_users' })
  update(data) {
    return this.usersService.update(data.id, data.data);
  }

  @MessagePattern({ cmd: 'delete_users' })
  remove(id: string) {
    return this.usersService.remove(id);
  }

  @MessagePattern({ cmd: 'block_users' })
  blockUser(id: string) {
    return this.usersService.blockUser(id);
  }

  @MessagePattern({ cmd: 'unblock_users' })
  unblockUser(id: string, data: UserInterface) {
    return this.usersService.unblockUser(id);
  }

  @MessagePattern({ cmd: 'update_password' })
  updatePassword(data) {
    return this.usersService.updatePassword(data.id, data.password);
  }

  @MessagePattern({ cmd: 'get_username' })
  getUsername(data) {
    console.log('get_username', data);
    return this.usersService.getUsername(data);
  }
}
