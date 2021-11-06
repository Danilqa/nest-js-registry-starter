import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserMapper } from './user.mapper';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [UserController],
    providers: [UserService, UserMapper]
})
export class UserModule {
}
