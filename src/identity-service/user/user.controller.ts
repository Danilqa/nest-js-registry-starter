import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserSaveDto } from './dto/user-save.dto';
import { UserService } from './user.service';
import { ApiBody } from '@nestjs/swagger';

@Controller(UserController.ROOT_PATH)
export class UserController {
    static ROOT_PATH = 'users';

    constructor(private readonly userService: UserService) {
    }

    @ApiBody({ type: UserSaveDto })
    @Post()
    create(@Body() item: UserSaveDto): Promise<UserDto> {
        return this.userService.create(item);
    }

    @Get()
    findAll(): Promise<UserDto[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<UserDto> {
        return this.userService.findById(id);
    }
}
