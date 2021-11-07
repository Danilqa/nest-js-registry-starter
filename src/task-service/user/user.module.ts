import { Module } from '@nestjs/common';
import { UserConsumerService } from './user.consumer.service';
import { UserMapper } from './user.mapper';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    providers: [UserConsumerService, UserMapper]
})
export class UserModule {
}
