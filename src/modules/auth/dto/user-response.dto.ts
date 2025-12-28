import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponse {
  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  bio: string;

  @Expose()
  image: string;

  @Expose()
  token?: string;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}