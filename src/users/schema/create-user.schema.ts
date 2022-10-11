import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import Role from '../role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop({ default: 'Active' })
  status: string;

  @Prop({ default: Date.now })
  registerDate: Date;

  @Prop({ type: String, enum: Role, default: Role.User })
  public role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
