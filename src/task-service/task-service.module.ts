import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../environments';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { KafkaModule } from '../common/kafka/kafka.module';

const { task: { db } } = environment;

@Module({
    imports: [
        TaskModule,
        UserModule,
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
