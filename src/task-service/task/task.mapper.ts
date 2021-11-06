import { Task } from './task.schema';
import { TaskDto } from './dto/task.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskMapper {

    fromSchemaToDtoMany(value: Task[]): TaskDto[] {
        return value.map(this.fromSchemaToDto);
    }

    fromSchemaToDto(value: Task): TaskDto {
        return {
            id: value.id,
            description: value.description,
            status: value.status,
            assignedUserId: value.assignedUserId
        };
    }
}
