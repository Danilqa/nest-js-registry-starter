import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { UserMapper } from './user.mapper';
import { UserDto } from './dto/user.dto';
import { UserRole } from './user.enums';

@Injectable()
export class UserService {

    constructor(
        private readonly userMapper: UserMapper,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {
    }

    async getAll(): Promise<UserDto[]> {
        const rawEntities = await this.userModel.find();
        return this.userMapper.fromSchemaToDtoMany(rawEntities);
    }

    async getAllWorkers(): Promise<UserDto[]> {
        const rawEntities = await this.userModel.find({ role: UserRole.WORKER }).exec();
        return this.userMapper.fromSchemaToDtoMany(rawEntities);
    }
}
