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

    async feed(exeId: string, userId: string) {
        const exe = await this.prisma.exe.findFirst({ where: { id: exeId, userId } });
        if (!exe) throw new NotFoundException('Exe not found');

        const decayedExe = await this.applyDecayAndReturn(exe);

        const newHunger = Math.min(100, decayedExe.hunger + 20);
        const newBond = Math.min(100, decayedExe.bond + 2);
        const newCorruption = Math.max(0, decayedExe.corruption - 1);
        const now = new Date();

        return this.prisma.exe.update({
            where: { id: exe.id },
            data: {
                hunger: newHunger,
                bond: newBond,
                corruption: newCorruption,
                updatedAt: now,
            },
        });
    }

    private async applyDecayAndReturn(exe: any) {
        const { decay, updatedAt } = this.calculateDecay(exe);

        return this.prisma.exe.update({
            where: { id: exe.id },
            data: {
                hunger: decay.hunger,
                sleep: decay.sleep,
                hygiene: decay.hygiene,
                bond: decay.bond,
                corruption: decay.corruption,
                updatedAt,
            },
        });

    }

    private calculateDecay(exe: any) {
        const now = new Date();
        const hours = (now.getTime() - new Date(exe.updatedAt).getTime()) / 3600000;

        const hunger = Math.max(0, exe.hunger - Math.floor(hours * 5));
        const sleep = Math.max(0, exe.sleep - Math.floor(hours * 3));
        const hygiene = Math.max(0, exe.hygiene - Math.floor(hours * 2));
        let corruption = exe.corruption;
        let bond = exe.bond;
        let syc = exe.syc;
        let pot = exe.pot;
        let tec = exe.tec;

        let forcedSleep = false;

        if (sleep <= 0 && hours > 4) {
            corruption = Math.min(100, corruption + 1);
            bond = Math.max(0, bond - 1);
            syc = Math.max(0, syc - 2);
            forcedSleep = true;
        }

        if (hunger <= 0) {
            corruption = Math.min(100, corruption + 2);
            bond = Math.max(0, bond - 1);
            pot = Math.max(0, pot - 1);
        }

        if (hygiene <= 0 && hours > 6) {
            corruption = Math.min(100, corruption + 1);
            tec = Math.max(0, tec - 1);
        }

        return {
            decay: {
                hunger,
                sleep,
                hygiene,
                corruption,
                bond,
                syc,
                pot,
                tec,
                forcedSleep,
            },
            updatedAt: now,
        };
    }

    async getStatusPreview(exeId: string, userId: string) {
        const exe = await this.prisma.exe.findFirst({ where: { id: exeId, userId } });
        if (!exe) throw new NotFoundException('Exe not found');

        const { decay } = this.calculateDecay(exe);
        return {
            ...decay,
            lastUpdate: exe.updatedAt,
        };
    }

    async clean(exeId: string, userId: string) {
        const exe = await this.prisma.exe.findFirst({ where: { id: exeId, userId } });
        if (!exe) throw new NotFoundException('Exe not found');

        const decayedExe = await this.applyDecayAndReturn(exe);

        const newHygiene = Math.min(100, decayedExe.hygiene + 30);
        const newBond = Math.min(100, decayedExe.bond + 1);
        const newCorruption = Math.max(0, decayedExe.corruption - 2);

        return this.prisma.exe.update({
            where: { id: exe.id },
            data: {
                hygiene: newHygiene,
                bond: newBond,
                corruption: newCorruption,
                updatedAt: new Date(),
            },
        });
    }

    async sleep(exeId: string, userId: string) {
        const exe = await this.prisma.exe.findFirst({ where: { id: exeId, userId } });
        if (!exe) throw new NotFoundException('Exe not found');

        const decayedExe = await this.applyDecayAndReturn(exe);

        const newSleep = Math.min(100, decayedExe.sleep + 40);
        const newSyc = Math.min(100, decayedExe.syc + 2);
        const newBond = Math.min(100, decayedExe.bond + 2);

        return this.prisma.exe.update({
            where: { id: exe.id },
            data: {
                sleep: newSleep,
                syc: newSyc,
                bond: newBond,
                updatedAt: new Date(),
            },
        });
    }

    async sync(exeId: string, userId: string) {
        const exe = await this.prisma.exe.findFirst({ where: { id: exeId, userId } });
        if (!exe) throw new NotFoundException('Exe not found');

        const decayedExe = await this.applyDecayAndReturn(exe);

        const newSyc = Math.min(100, decayedExe.syc + 5);
        const newBond = Math.min(100, decayedExe.bond + 1);
        const newCorruption = Math.max(0, decayedExe.corruption - 1);

        return this.prisma.exe.update({
            where: { id: exe.id },
            data: {
                syc: newSyc,
                bond: newBond,
                corruption: newCorruption,
                updatedAt: new Date(),
            },
        });
    }

}
