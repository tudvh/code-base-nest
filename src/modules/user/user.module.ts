import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'

import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User } from '@/database/entities'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
