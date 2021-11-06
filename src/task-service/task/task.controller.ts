import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { TaskSaveDto } from './dto/task-save.dto';
import { TaskService } from './task.service';

@Controller(TaskController.ROOT_PATH)
export class TaskController {
    static ROOT_PATH = 'tasks';

    constructor(private readonly taskService: TaskService) {
    }

    @Post()
    create(@Body() item: TaskSaveDto): Promise<TaskDto> {
        return this.taskService.create(item);
    }

    @Post()
    assignAll(@Body() item: TaskSaveDto): Promise<TaskDto> {
        return this.taskService.create(item);
    }

    @Get()
    findAll(): Promise<TaskDto[]> {
        return this.taskService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<TaskDto> {
        return this.taskService.findById(id);
    }
}
