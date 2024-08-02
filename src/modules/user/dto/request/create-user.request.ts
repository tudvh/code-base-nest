import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @Expose()
  surname: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @Expose()
  givenName: string
}
