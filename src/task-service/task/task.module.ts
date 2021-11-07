import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.schema';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskMapper } from './task.mapper';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../user/user.schema';
import { UserMapper } from '../user/user.mapper';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    controllers: [TaskController],
    providers: [TaskService, UserService, TaskMapper, UserMapper]
})
export class TaskModule {
}
