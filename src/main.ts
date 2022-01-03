import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { GOODREAD_AUTHOR_PACKAGE_NAME } from './dto/author';
import { GOODREAD_BOOK_PACKAGE_NAME } from './dto/book';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: [GOODREAD_AUTHOR_PACKAGE_NAME, GOODREAD_BOOK_PACKAGE_NAME],
      url: `0.0.0.0:8082`,
      protoPath: [
        join(__dirname, './grpc/author.proto'),
        join(__dirname, './grpc/book.proto'),
      ],
    },
  });

  app.startAllMicroservices();
  app.listen(8083);
}

bootstrap();
