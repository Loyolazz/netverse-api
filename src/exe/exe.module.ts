import { Module } from '@nestjs/common';
import { ExeController } from './exe.controller';
import { ExeService } from './exe.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ExeController],
  providers: [ExeService],
  exports: [ExeService],
})
export class ExeModule {}
