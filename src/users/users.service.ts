import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/create-user.schema';
import * as bcrypt from 'bcrypt';
import { UpdatePassword, UserInterface } from './interface/user.interface';
import { hash } from 'bcrypt';
import Role from './role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private saltOrRounds = 10;

  async userCreate(data: UserInterface) {
    const { username } = data;
    const CheckUsername = await this.userModel.findOne({ username });

    if (CheckUsername) {
      //มีผู้ใช้งานชื่อนี้แล้ว
      throw new HttpException(
        'username already exists',
        HttpStatus.BAD_REQUEST,
      );
      // return 'username already exit';
    }

    const hashPass = await bcrypt.hash(data.password, this.saltOrRounds);
    data.password = hashPass;
    data.role = Role.User;
    const newUser = await new this.userModel(data);
    return newUser.save();
  }

  async findAll() {
    const users = await this.userModel.find();
    console.log(users);
    if (users.length > 0) {
      return users;
    } else {
      return `Is Empty`;
    }
  }

  async findByUsername(username: string) {
    // return `This action returns a #${id} book`;
    const SearchUserbyUsername = await this.userModel.find({
      username: { $regex: '.*' + username + '.*' },
    });

    // console.log(Searchbook)

    if (SearchUserbyUsername.length > 0) {
      return SearchUserbyUsername;
    } else {
      return `Is Empty`;
    }
  }

  async newUsers() {
    var start = new Date();
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);
    const user = await this.userModel.find({
      registerDate: {
        $gte: start,
        $lt: end,
      },
    });

    if (user.length > 0) {
      return user;
    } else {
      return `Not found new users today`;
    }
  }

  async findOne() {
    const users = await this.userModel.find();
    console.log(users);
    if (users.length > 0) {
      return users;
    } else {
      return `Is Empty`;
    }
  }

  async update(id: string, data: UserInterface) {
    const updateUserData = await this.userModel.findByIdAndUpdate(id, data);
    if (updateUserData) {
      return updateUserData;
    } else {
      return new HttpException('Cannot update user', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    const deleteUser = await this.userModel
      .findByIdAndRemove({ _id: id })
      .exec();
    if (deleteUser) {
      return `User data deleted`;
    } else {
      throw new HttpException(
        'Book was not found for parameters',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async blockUser(id: string) {
    const updateUserData = await this.userModel.findByIdAndUpdate(
      { _id: id },
      { status: 'Block' },
    );
    return `User Blocked`;
  }

  async unblockUser(id: string) {
    const updateUserData = await this.userModel.findByIdAndUpdate(
      { _id: id },
      { status: 'Active' },
    );
    return `User Unblocked`;
  }

  async getUsername(userName: string) {
    const username = userName;
    const user = await this.userModel.findOne({ username });
    console.log(user);
    return user;
  }

  async updatePassword(id: string, password: UpdatePassword) {
    const user = await this.userModel.findById(id);
    let isValidPassword = await bcrypt.compare(password.old, user.password);

    if (isValidPassword) {
      const hashnewPass = await bcrypt.hash(password.new, this.saltOrRounds);
      const updatePass = this.userModel.findByIdAndUpdate({
        _id: id,
        password: hashnewPass,
      });

      console.log(user.password);
      console.log(password.new);

      return 'password updated';
    }

    console.log(user.password);
    console.log(password.new);

    return 'password incorrect';
  }

  async userPurchaseBook(id: string) {
    const data = this.userModel.findById(id);

    console.log(data);
    return data;
  }
}
