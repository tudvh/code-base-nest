import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'

import { CreateUserDto } from './dto/request'
import { UserResponse } from './dto/response'
import { User } from '@/database/entities'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const validatedDto = plainToInstance(CreateUserDto, createUserDto, {
      excludeExtraneousValues: true,
    })

    // Create a new user
    const user = this.userRepository.create(validatedDto)

    // Save
    await this.userRepository.save(user)

    return plainToInstance(UserResponse, user, {
      excludeExtraneousValues: true,
    })
  }

  public async createUsingTransaction(createUserDto: CreateUserDto): Promise<UserResponse> {
    const validatedDto = plainToInstance(CreateUserDto, createUserDto, {
      excludeExtraneousValues: true,
    })

    // Create a new user
    const user = this.userRepository.create(validatedDto)

    // Save
    await this.userRepository.manager.transaction(async transactionEntityManager => {
      await transactionEntityManager.save(user)
    })

    return plainToInstance(UserResponse, user, {
      excludeExtraneousValues: true,
    })
  }
}
