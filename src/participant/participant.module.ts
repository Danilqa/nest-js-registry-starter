import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { RefNumberAllocatorService } from './services/ref-number-allocator.service';
import { Participant, ParticipantSchema } from './schemas/participant.schema';
import { ParticipantMapper } from './mapper/mapper';

@Module({
    imports: [MongooseModule.forFeature([{ name: Participant.name, schema: ParticipantSchema }])],
    controllers: [ParticipantController],
    providers: [ParticipantService, RefNumberAllocatorService, ParticipantMapper]
})
export class ParticipantModule {
}