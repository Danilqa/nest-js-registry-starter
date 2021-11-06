import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserSaveDto } from './dto/user-save.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserMapper } from './user.mapper';
import { User, UserDocument } from './user.schema';
import { uuid } from 'uuidv4';
import { hash, compare } from 'bcrypt';
import { KafkaService } from '../../common/kafka/kafka.service';
import { TOPIC } from '../common/consts/topics.consts';
import { KafkaPayload } from '../../common/kafka/kafka.message';
import { BrokerEventType } from './user.enums';

@Injectable()
export class UserService {
    private static SALT_ROUNDS = 10;

    constructor(
        private readonly userMapper: UserMapper,
        private readonly kafkaService: KafkaService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async create(entity: UserSaveDto): Promise<UserDto> {
        const theSameUser = await this.userModel.findOne({ name: entity.name });
        if (theSameUser) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const id = uuid();
        let createdEntity: UserDocument;
        try {
            const secret = await hash(entity.password, UserService.SALT_ROUNDS);
            createdEntity = await this.userModel.create({ ...entity, id, secret });
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }

        const dto = this.userMapper.fromSchemaToDto(createdEntity);
        const payload = new KafkaPayload({
            body: dto,
            topicName: TOPIC.USERS,
            messageType: BrokerEventType.CREATED
        });
        await this.kafkaService.sendMessage(TOPIC.USERS, payload);
        console.log('user was sent to the broker');

        return dto;
    }

    async update(id: string, fieldsToUpdate: Partial<UserSaveDto>): Promise<UserDto> {
        if (!id) {
            throw new HttpException('Id was not provided', HttpStatus.BAD_REQUEST);
        }

        const foundUser = await this.userModel.findOne({ id }).exec();
        if (!foundUser) {
            throw new HttpException(`User ${id} was not found`, HttpStatus.NOT_FOUND);
        }

        const updatedUser = foundUser.set(fieldsToUpdate);
        try {
            await updatedUser.updateOne(fieldsToUpdate).exec();
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }

        return this.userMapper.fromSchemaToDto(updatedUser);
    }

    async delete(id: string): Promise<void> {
        const foundParticipant = await this.userModel.findOne({ id }).exec();
        if (!foundParticipant) {
            throw new HttpException(`User ${id} was not found`, HttpStatus.NOT_FOUND);
        }

        await foundParticipant.deleteOne();
    }

    async findAll(): Promise<UserDto[]> {
        const items = await this.userModel.find().exec();
        return this.userMapper.fromSchemaToDtoMany(items);
    }

    async findById(id: string): Promise<UserDto> {
        const foundUser = await this.userModel.findOne({ id });
        if (!foundUser) {
            throw new HttpException(`User ${id} was not found`, HttpStatus.NOT_FOUND);
        }

        return this.userMapper.fromSchemaToDto(foundUser);
    }

    async auth(name: string, password: string): Promise<UserDto> {
        const foundUser = await this.userModel.findOne({ name });
        if (!foundUser) {
            throw new HttpException(`User ${name} was not found`, HttpStatus.NOT_FOUND);
        }

        const isValid = await compare(password, foundUser.secret);
        if (!isValid) {
            throw new HttpException('Password is not valid', HttpStatus.BAD_REQUEST);
        }

        return this.userMapper.fromSchemaToDto(foundUser);
    }
}
