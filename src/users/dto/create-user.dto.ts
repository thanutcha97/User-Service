import Role from '../role.enum';

export class CreateUserDto {
  username: string;
  password: string;
  role: Role;
}
