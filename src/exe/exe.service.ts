import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExeDto } from './dto/create-exe.dto';

@Injectable()
export class ExeService {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, dto: CreateExeDto) {
        return this.prisma.exe.create({
            data: {
                name: dto.name,
                type: dto.type,
                stage: dto.stage || 'ini',
                level: dto.level ?? 1,
                userId,
                pot: 5,
                res: 5,
                spd: 5,
                syc: 10,
                tec: 5,
                bond: 0,
                corruption: 0,
                hunger: 100,
                hygiene: 100,
                sleep: 100,
                imageUrl: dto.imageUrl ?? null,
                description: dto.description ?? null,
            },
        });
    }


    async findAllByUser(userId: string) {
        return this.prisma.exe.findMany({ where: { userId } });
    }

    async evolve(exeId: string, userId: string) {
        const exe = await this.prisma.exe.findFirst({ where: { id: exeId, userId } });
        if (!exe) throw new NotFoundException('Exe not found');
        let updatedExe = exe;
        if (exe.stage === 'ini' && exe.level >= 15) {
            updatedExe = await this.prisma.exe.update({
                where: { id: exe.id },
                data: {
                    stage: 'boot',
                    pot: exe.pot + 2,
                    res: exe.res + 2,
                    spd: exe.spd + 1,
                    tec: exe.tec + 1,
                    syc: exe.syc + 1,
                },
            });
        } else if (exe.stage === 'boot' && exe.level >= 30) {
            updatedExe = await this.prisma.exe.update({
                where: { id: exe.id },
                data: {
                    stage: 'sys',
                    pot: exe.pot + 3,
                    res: exe.res + 3,
                    spd: exe.spd + 2,
                    tec: exe.tec + 2,
                    syc: exe.syc + 2,
                },
            });
        } else if (exe.stage === 'sys' && exe.level >= 45) {
            updatedExe = await this.prisma.exe.update({
                where: { id: exe.id },
                data: {
                    stage: 'core',
                    pot: exe.pot + 4,
                    res: exe.res + 4,
                    spd: exe.spd + 3,
                    tec: exe.tec + 3,
                    syc: exe.syc + 3,
                },
            });
        } else if (exe.stage === 'core' && exe.level >= 60) {
            updatedExe = await this.prisma.exe.update({
                where: { id: exe.id },
                data: {
                    stage: 'root',
                    pot: exe.pot + 5,
                    res: exe.res + 5,
                    spd: exe.spd + 4,
                    tec: exe.tec + 4,
                    syc: exe.syc + 4,
                },
            });
        } else {
            throw new BadRequestException('Exe cannot evolve at this time');
        }
        return updatedExe;
    }
}
