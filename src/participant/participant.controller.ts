import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantDto } from './dto/participant.dto';
import { ParticipantSaveDto } from './dto/participant-save.dto';
import { RefNumber } from '../@types/common';

@Controller(ParticipantController.ROOT_PATH)
export class ParticipantController {
    static ROOT_PATH = 'participants';

    constructor(private readonly participantService: ParticipantService) {
    }

    @Post()
    create(@Body() item: ParticipantSaveDto): Promise<ParticipantDto> {
        return this.participantService.create(item);
    }

    @Patch(':id')
    update(@Body() item: Partial<ParticipantSaveDto>, @Param('id') id: RefNumber): Promise<ParticipantDto> {
        return this.participantService.update(id, item);
    }

    @Get()
    findAll(): Promise<ParticipantDto[]> {
        return this.participantService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: RefNumber): Promise<ParticipantDto> {
        return this.participantService.find(id);
    }

    @Delete(':id')
    delete(@Param('id') id: RefNumber): Promise<void> {
        return this.participantService.delete(id);
    }
}