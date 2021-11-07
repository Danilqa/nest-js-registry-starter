import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../environments';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { KafkaModule } from '../common/kafka/kafka.module';
import { HttpModule } from '@nestjs/axios';

const { task: { db } } = environment;

@Global()
@Module({
    imports: [
        TaskModule,
        UserModule,
        HttpModule,
        KafkaModule.register({
            clientId: 'task-client',
            brokers: [ environment.broker.url],
            groupId: environment.broker.groupId
        }),
        MongooseModule.forRoot(
            `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.dbname}`
        )
    ]
})
export class TaskServiceModule {
}
