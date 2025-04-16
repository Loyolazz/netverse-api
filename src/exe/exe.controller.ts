import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt/jwt.guard';
import { AuthRequest } from '../common/types/auth-request';
import { CreateExeDto } from './dto/create-exe.dto';
import { ExeService } from './exe.service';
import { Patch } from '@nestjs/common';

@Controller('exe')
@UseGuards(JwtAuthGuard)
export class ExeController {
    constructor(private readonly exeService: ExeService) {}

    @Post()
    async create(@Body() dto: CreateExeDto, @Req() req: AuthRequest) {
        const userId = req.user.sub;
        return this.exeService.create(userId, dto);
    }

    @Get()
    async listAll(@Req() req: AuthRequest) {
        const userId = req.user.sub;
        return this.exeService.findAllByUser(userId);
    }

    @Post(':id/evolve')
    async evolve(@Param('id') exeId: string, @Req() req: AuthRequest) {
        const userId = req.user.sub;
        return this.exeService.evolve(exeId, userId);
    }

    @Patch(':id/feed')
    async feed(@Param('id') exeId: string, @Req() req: AuthRequest) {
        const userId = req.user.sub;
        return this.exeService.feed(exeId, userId);
    }

    @Get(':id/status-preview')
    async getPreview(@Param('id') exeId: string, @Req() req: AuthRequest) {
        const userId = req.user.sub;
        return this.exeService.getStatusPreview(exeId, userId);
    }

    @Patch(':id/clean')
    async clean(@Param('id') exeId: string, @Req() req: AuthRequest) {
        const userId = req.user.sub;
        return this.exeService.clean(exeId, userId);
    }

    @Patch(':id/sleep')
    async sleep(@Param('id') exeId: string, @Req() req: AuthRequest) {
        const userId = req.user.sub;
        return this.exeService.sleep(exeId, userId);
    }

    @Patch(':id/sync')
    async sync(@Param('id') exeId: string, @Req() req: AuthRequest) {
        const userId = req.user.sub;
        return this.exeService.sync(exeId, userId);
    }

}
