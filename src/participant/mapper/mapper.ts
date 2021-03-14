import { Participant } from '../schemas/participant.schema';
import { ParticipantDto } from '../dto/participant.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParticipantMapper {

    fromSchemaToDtoMany(value: Participant[]): ParticipantDto[] {
        return value.map(this.fromSchemaToDto);
    }

    fromSchemaToDto(value: Participant): ParticipantDto {
        return {
            id: value.id,
            name: value.name,
            birthdate: value.birthdate,
            phoneNumber: value.phoneNumber,
            address: value.address
        };
    }
}