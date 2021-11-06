import { User } from './user.schema';
import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

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

    fromDtoToSchema(value: UserDto): User {
        return {
            id: value.id,
            name: value.name,
            role: value.role
        }
    }
}
