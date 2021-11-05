import { User } from '../../user/user.schema';
import { UserDto } from '../../user/dto/user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParticipantMapper {

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
