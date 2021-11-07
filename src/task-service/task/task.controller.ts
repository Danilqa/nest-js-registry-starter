import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { TaskSaveDto } from './dto/task-save.dto';
import { TaskService } from './task.service';
import { ApiBody } from '@nestjs/swagger';

@Controller(TaskController.ROOT_PATH)
export class TaskController {
    static ROOT_PATH = 'tasks';

    constructor(private readonly taskService: TaskService) {
    }

    @ApiBody({ type: TaskSaveDto })
    @Post()
    create(@Body() item: TaskSaveDto): Promise<TaskDto> {
        return this.taskService.create(item);
    }

    @Post('assign-all')
    assignAll(): Promise<void> {
        return this.taskService.assignAll();
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
