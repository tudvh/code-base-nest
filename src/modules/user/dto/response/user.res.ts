import { Expose, Transform } from 'class-transformer'

export class UserResponse {
  @Expose()
  id: number

  @Expose()
  @Transform(({ obj }) => obj.fullName)
  name: string
}
