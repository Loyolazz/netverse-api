import { Injectable, BadRequestException } from '@nestjs/common';
import { ExeType, Stage } from '@prisma/client';
import { ExeService } from '../exe/exe.service';

export interface EggOption {
    type: ExeType;
    name: string;
    imageUrl: string;
    description: string;
}

@Injectable()
export class EggService {
    constructor(private readonly exeService: ExeService) {}

    private eggOptions: EggOption[] = [
        {
            type: 'fire',
            name: 'Egg of Fire',
            imageUrl: 'https://cdn.netverso.com/eggs/fire.png',
            description: 'Um ovo flamejante, carregado com energia e pronto para incendiar o mundo.',
        },
        {
            type: 'thunder',
            name: 'Egg of Thunder',
            imageUrl: 'https://cdn.netverso.com/eggs/thunder.png',
            description: 'Um ovo eletrizante, onde o potencial vibrante do trovão já se faz presente.',
        },
        {
            type: 'metal',
            name: 'Egg of Metal',
            imageUrl: 'https://cdn.netverso.com/eggs/metal.png',
            description: 'Um ovo robusto, forjado na essência do metal, sólido e resistente.',
        },
        {
            type: 'neutral',
            name: 'Egg of Neutral',
            imageUrl: 'https://cdn.netverso.com/eggs/neutral.png',
            description: 'Um ovo equilibrado, com uma essência adaptável e misteriosa.',
        },
    ];

    getEggOptions(): EggOption[] {
        return this.eggOptions;
    }

    async selectEgg(userId: string, eggType: ExeType) {
        const eggOption = this.eggOptions.find(e => e.type === eggType);
        if (!eggOption) {
            throw new BadRequestException('Tipo de ovo inválido');
        }

        const newExeData = {
            name: eggOption.name.replace('Egg of ', ''),
            type: eggOption.type,
            stage: 'ini' as Stage,
            level: 1,
            imageUrl: eggOption.imageUrl,
            description: eggOption.description,
        };

        return this.exeService.create(userId, newExeData);
    }
}
