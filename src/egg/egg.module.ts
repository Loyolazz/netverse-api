import { Module } from '@nestjs/common';
import { EggService } from './egg.service';
import { EggController } from './egg.controller';
import { ExeModule } from '../exe/exe.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ExeModule, AuthModule],
  controllers: [EggController],
  providers: [EggService],
})
export class EggModule {}
