import { User } from './user.schema';
import { UserDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMapper {

    fromSchemaToDtoMany(value: User[]): UserDto[] {
        return value.map(this.fromSchemaToDto);
    }

    fromSchemaToDto(value: User): UserDto {
        return {
            id: value.id,
            name: value.name,
            role: value.role
        };
    }
}
