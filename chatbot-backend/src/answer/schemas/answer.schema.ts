import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnswerDocument = Answer & Document;

@Schema()
export class Response {
    @Prop({ required: true })
    question: string;

    @Prop({ required: true })
    answer: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

@Schema()
export class Answer {
    @Prop({ required: true })
    sessionId: string;

    @Prop({ default: Date.now })
    endTime: Date;

    @Prop({ type: [Response], default: [] })
    responses: Response[];
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
