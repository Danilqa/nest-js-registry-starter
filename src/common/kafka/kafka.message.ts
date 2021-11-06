import { uuid } from 'uuidv4';
import { AnyDictionary } from '@eigenspace/common-types';

interface Props {
    body: AnyDictionary;
    topicName: string;
    messageType: string;
}

export class KafkaPayload {
    body: string;
    messageId: string;
    topicName: string;
    messageType: string;
    createdAt?: string;

    constructor(props: Props) {
        this.messageId = uuid();
        this.messageType = props.messageType;
        this.body = JSON.stringify(props.body);
        this.topicName = props.topicName;
        this.createdAt = new Date().toISOString();
    }
}

export declare class KafkaConfig {
    clientId: string;
    brokers: string[];
    groupId: string;
}
