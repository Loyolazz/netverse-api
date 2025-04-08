import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ExeService } from './exe.service';
import { CreateExeDto } from './dto/create-exe.dto';
import { JwtAuthGuard } from '../common/guards/jwt/jwt.guard';

@Controller('exe')
@UseGuards(JwtAuthGuard)
export class ExeController {
    constructor(private readonly exeService: ExeService) {}

    @Post()
    async create(@Body() dto: CreateExeDto, @Req() req) {
        const userId = req.user.sub;
        return this.exeService.create(userId, dto);
    }

    @Get()
    async listAll(@Req() req) {
        const userId = req.user.sub;
        return this.exeService.findAllByUser(userId);
    }

    @Post(':id/evolve')
    async evolve(@Param('id') exeId: string, @Req() req) {
        const userId = req.user.sub;
        return this.exeService.evolve(exeId, userId);
    }
}
