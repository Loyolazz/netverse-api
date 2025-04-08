import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ExeModule } from './exe/exe.module';
import { EggModule } from './egg/egg.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, ExeModule, EggModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
