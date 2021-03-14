import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ParticipantDto } from './dto/participant.dto';
import { RefNumberAllocatorService } from './services/ref-number-allocator.service';
import { ParticipantSaveDto } from './dto/participant-save.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Participant, ParticipantDocument } from './schemas/participant.schema';
import { Model } from 'mongoose';
import { ParticipantMapper } from './mapper/mapper';
import { RefNumber } from '../@types/common';

@Injectable()
export class ParticipantService {

    constructor(
        private readonly refNumberService: RefNumberAllocatorService,
        private readonly participantMapper: ParticipantMapper,
        @InjectModel(Participant.name) private participantModel: Model<ParticipantDocument>
    ) {}

    async create(participant: ParticipantSaveDto): Promise<ParticipantDto> {
        const id = this.refNumberService.generate();

        let createdParticipant: ParticipantDocument;
        try {
            createdParticipant = await this.participantModel.create({ ...participant, id });
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }

        return this.participantMapper.fromSchemaToDto(createdParticipant);
    }

    async update(id: RefNumber, fieldsToUpdate: Partial<ParticipantSaveDto>): Promise<ParticipantDto> {
        if (!id) {
            throw new HttpException('Id was not provided', HttpStatus.BAD_REQUEST);
        }

        const foundParticipant = await this.participantModel.findOne({ id }).exec();
        if (!foundParticipant) {
            throw new HttpException(`Participant ${id} was not found`, HttpStatus.NOT_FOUND);
        }

        const updatedParticipant = foundParticipant.set(fieldsToUpdate);
        try {
            await updatedParticipant.updateOne(fieldsToUpdate).exec();
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }

        return this.participantMapper.fromSchemaToDto(updatedParticipant);
    }

    async delete(id: string): Promise<void> {
        const foundParticipant = await this.participantModel.findOne({ id }).exec();
        if (!foundParticipant) {
            throw new HttpException(`Participant ${id} was not found`, HttpStatus.NOT_FOUND);
        }

        await foundParticipant.deleteOne();
    }

    async findAll(): Promise<ParticipantDto[]> {
        const items = await this.participantModel.find().exec();
        return this.participantMapper.fromSchemaToDtoMany(items);
    }

    async find(id: string): Promise<ParticipantDto> {
        const foundParticipant = await this.participantModel.findOne({ id });
        if (!foundParticipant) {
            throw new HttpException(`Participant ${id} was not found`, HttpStatus.NOT_FOUND);
        }

        return this.participantMapper.fromSchemaToDto(foundParticipant);
    }
}