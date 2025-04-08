import { Module } from '@nestjs/common';
import { ExeService } from './exe.service';
import { ExeController } from './exe.controller';

@Module({
  providers: [ExeService],
  controllers: [ExeController]
})
export class ExeModule {}
