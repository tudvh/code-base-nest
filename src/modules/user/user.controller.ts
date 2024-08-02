import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'

import { CreateUserDto } from './dto/request'
import { UserResponse } from './dto/response'
import { UserService } from './user.service'

@Controller('api/services/app/User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/Create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    const data = await this.userService.create(createUserDto)
    return data
  }
}
