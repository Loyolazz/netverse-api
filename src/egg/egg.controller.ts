import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { EggService } from './egg.service';
import { JwtAuthGuard } from '../common/guards/jwt/jwt.guard';

@Controller('egg')
@UseGuards(JwtAuthGuard)
export class EggController {
    constructor(private readonly eggService: EggService) {}

    @Get('options')
    getOptions() {
        return this.eggService.getEggOptions();
    }

    @Post('select')
    async selectEgg(@Body() body: { type: string }, @Req() req) {
        const userId = req.user.sub;
        return this.eggService.selectEgg(userId, body.type as any);
    }
}
