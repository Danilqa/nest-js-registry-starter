import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { UserMapper } from '../user/user.mapper';
import { KafkaModule } from '../../common/kafka/kafka.module';
import { environment } from '../../environments';

@Module({
    imports: [
        KafkaModule.register({
            clientId: 'auth-client',
            brokers: [ environment.broker.url],
            groupId: environment.broker.groupId
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, UserMapper]
})
export class AuthModule {
}
