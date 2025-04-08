import { ExeType, Stage } from '@prisma/client';

export class CreateExeDto {
    name: string;
    type: ExeType;
    stage?: Stage;
    level?: number;
    imageUrl?: string;
    description?: string;
}
