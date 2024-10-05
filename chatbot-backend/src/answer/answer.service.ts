import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer } from './schemas/answer.schema';

@Injectable()
export class AnswerService {
    constructor(@InjectModel(Answer.name) private answerModel: Model<Answer>) {}

    async createAnswer(sessionId: string, question: string, answer: string, finished: string): Promise<Answer> {
        // Mevcut bir yanıt var mı kontrol et
        const existingAnswer = await this.answerModel.findOne({ sessionId });

        if (!existingAnswer) {
                // Eğer yoksa yeni bir kayıt oluştur
                const newAnswer = new this.answerModel({
                    sessionId,
                    endTime: '',
                    responses: [{ question, answer, createdAt: new Date() }]
                });
                return newAnswer.save();
        } else {
            if(finished === "false") {
                // Eğer mevcutsa yanıtı güncelle
                console.log("girdi1")
                existingAnswer.responses.push({ question, answer, createdAt: new Date() });
                return existingAnswer.save();
            }else{
                existingAnswer.responses.push({ question, answer, createdAt: new Date() });
                if (finished === "true") {
                    // Eğer finished true ise endTime'ı güncelle
                    existingAnswer.endTime = new Date();
                }
                return existingAnswer.save();
            }

        }
    }

    async getAnswers(sessionId: string): Promise<Answer> {
        return this.answerModel.findOne({ sessionId }).exec();
    }
}
