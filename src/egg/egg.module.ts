import { Module } from '@nestjs/common';
import { EggService } from './egg.service';
import { EggController } from './egg.controller';

@Module({
  providers: [EggService],
  controllers: [EggController]
})
export class EggModule {}
