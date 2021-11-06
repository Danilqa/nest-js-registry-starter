import { SUBSCRIBER_FN_REF_MAP } from '../../common/kafka/kafka.decorators';
import { Injectable } from '@nestjs/common';
import { KafkaPayload } from '../../common/kafka/kafka.message';
import { TOPIC } from '../common/consts/topics.consts';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { UserMapper } from './user.mapper';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserConsumerService {

    constructor(
        private readonly userMapper: UserMapper,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {
        // Сорян, через декораторы красиво не вышло. Как ни крути, теряется контекст.
        SUBSCRIBER_FN_REF_MAP.set(TOPIC.USERS, this.syncUsers.bind(this));
    }

    async syncUsers(payload: KafkaPayload): Promise<void> {
        const parsedEntity = this.userMapper.fromDtoToSchema(JSON.parse(payload.body) as UserDto);
        await this.userModel.create(parsedEntity);
    }
}
