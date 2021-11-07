import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TaskStatus } from './task.enums';

export type TaskDocument = Task & Document;

@Schema()
export class Task {

    @Prop({ required: true, unique: true, immutable: true })
    id: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    status: TaskStatus;

    @Prop()
    assignedUserId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
