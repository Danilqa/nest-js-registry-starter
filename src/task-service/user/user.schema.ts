import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from './user.enums';

export type UserDocument = User & Document;

@Schema()
export class User {

    @Prop({ required: true, unique: true, immutable: true })
    id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
