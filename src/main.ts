import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar Helmet para segurança contra ataques básicos
  app.use(helmet());
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const url = await app.getUrl();
  console.log(`🚀 Aplicação segura rodando em: ${url}`);
}
bootstrap().catch((error) => {
  console.error('Erro ao iniciar aplicação:', error);
  process.exit(1);
});
