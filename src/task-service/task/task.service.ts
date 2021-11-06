import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { TaskSaveDto } from './dto/task-save.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskMapper } from './task.mapper';
import { Task, TaskDocument } from './task.schema';
import { uuid } from 'uuidv4';
import { KafkaService } from '../../common/kafka/kafka.service';
import { TOPIC } from '../common/consts/topics.consts';
import { KafkaPayload } from '../../common/kafka/kafka.message';
import { BrokerEventType } from './task.enums';

@Injectable()
export class TaskService {

    constructor(
        private readonly taskMapper: TaskMapper,
        private readonly kafkaService: KafkaService,
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>
    ) {}

    async create(entity: TaskSaveDto): Promise<TaskDto> {
        const id = uuid();
        let createdEntity: TaskDocument = await this.taskModel.create({ ...entity, id });

        const dto = this.taskMapper.fromSchemaToDto(createdEntity);
        const payload = new KafkaPayload({
            body: dto,
            topicName: TOPIC.TASKS,
            messageType: BrokerEventType.CREATED
        });
        await this.kafkaService.sendMessage(TOPIC.TASKS, payload);

        return dto;
    }

    async assignAll(): Promise<void> {
    }

    async update(id: string, fieldsToUpdate: Partial<TaskSaveDto>): Promise<TaskDto> {
        if (!id) {
            throw new HttpException('Id was not provided', HttpStatus.BAD_REQUEST);
        }

        const foundUser = await this.taskModel.findOne({ id }).exec();
        if (!foundUser) {
            throw new HttpException(`Task ${id} was not found`, HttpStatus.NOT_FOUND);
        }

        const updatedUser = foundUser.set(fieldsToUpdate);
        try {
            await updatedUser.updateOne(fieldsToUpdate).exec();
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }

        return this.taskMapper.fromSchemaToDto(updatedUser);
    }

    async delete(id: string): Promise<void> {
        const foundParticipant = await this.taskModel.findOne({ id }).exec();
        if (!foundParticipant) {
            throw new HttpException(`Task ${id} was not found`, HttpStatus.NOT_FOUND);
        }

        await foundParticipant.deleteOne();
    }

    async findAll(): Promise<TaskDto[]> {
        const items = await this.taskModel.find().exec();
        return this.taskMapper.fromSchemaToDtoMany(items);
    }

    async findById(id: string): Promise<TaskDto> {
        const foundUser = await this.taskModel.findOne({ id });
        if (!foundUser) {
            throw new HttpException(`User ${id} was not found`, HttpStatus.NOT_FOUND);
        }

        return this.taskMapper.fromSchemaToDto(foundUser);
    }
}
