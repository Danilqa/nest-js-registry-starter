import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParticipantDocument = Participant & Document;

@Schema()
export class Participant {

    @Prop({ required: true, unique: true, immutable: true })
    id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, type: Date })
    birthdate: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ required: true })
    address: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);