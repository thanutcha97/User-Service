import Role from '../role.enum';

export class UserInterface {
  username: string;
  password: string;
  role: Role;
}

export class UpdatePassword {
  new: string;
  old: string;
}
