import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { TaskSaveDto } from './dto/task-save.dto';
import { TaskService } from './task.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../user/user.enums';
import { RolesGuard } from '../common/guards/role.guard';
import { Token } from '../common/entities/token';

@Controller(TaskController.ROOT_PATH)
export class TaskController {
    static ROOT_PATH = 'tasks';

    constructor(private readonly taskService: TaskService) {
    }

    @ApiBody({ type: TaskSaveDto })
    @UseGuards(AuthGuard)
    @Post()
    create(@Body() item: TaskSaveDto): Promise<TaskDto> {
        return this.taskService.create(item);
    }

    @ApiBearerAuth('access-token')
    @Roles(UserRole.ADMINISTRATOR, UserRole.MANAGER)
    @UseGuards(AuthGuard, RolesGuard)
    @Post('assign-all')
    assignAll(): Promise<void> {
        return this.taskService.assignAll();
    }

    @ApiBearerAuth('access-token')
    @Post('mine')
    @UseGuards(AuthGuard)
    findMy(@Headers('authorization') authorization: string): Promise<TaskDto[]> {
        const { user } = Token.createFromHeader(authorization);
        return this.taskService.findByAssignedUserId(user.id);
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
