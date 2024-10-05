import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { Answer } from './schemas/answer.schema';

@Controller('answers')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    // Cevaplar için POST endpoint
    @Post()
    async createAnswer(
        @Body('sessionId') sessionId: string,
        @Body('question') question: string,
        @Body('answer') answer: string,
        @Body('finished') finished: string,
    ) {
        return this.answerService.createAnswer(sessionId, question, answer, finished);
    }

    // Belirli bir sessionId'ye göre cevapları MongoDb'den getirem GET endpoint
    @Get(':sessionId')
    async getAnswers(@Param('sessionId') sessionId: string) {
        return this.answerService.getAnswers(sessionId);
    }
}
