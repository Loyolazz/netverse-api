import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ExeModule } from './exe/exe.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, ExeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
