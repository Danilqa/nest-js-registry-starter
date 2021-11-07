import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserSaveDto } from './dto/user-save.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/role.guard';
import { UserRole } from './user.enums';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller(UserController.ROOT_PATH)
export class UserController {
    static ROOT_PATH = 'users';

    constructor(private readonly userService: UserService) {
    }

    @ApiBearerAuth('access-token')
    @Roles(UserRole.ADMINISTRATOR, UserRole.MANAGER)
    @ApiBody({ type: UserSaveDto })
    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    create(@Body() item: UserSaveDto): Promise<UserDto> {
        return this.userService.create(item);
    }

    @ApiBearerAuth('access-token')
    @Roles(UserRole.ADMINISTRATOR, UserRole.MANAGER)
    @UseGuards(AuthGuard, RolesGuard)
    @Get()
    findAll(): Promise<UserDto[]> {
        return this.userService.findAll();
    }

    @ApiBearerAuth('access-token')
    @Roles(UserRole.ADMINISTRATOR, UserRole.MANAGER)
    @UseGuards(AuthGuard, RolesGuard)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<UserDto> {
        return this.userService.findById(id);
    }
}
