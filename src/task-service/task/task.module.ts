import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.schema';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskMapper } from './task.mapper';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])
    ],
    controllers: [TaskController],
    providers: [TaskService, TaskMapper]
})
export class TaskModule {
}
