import { Module } from '@nestjs/common';
import { AuthorController } from './goodread/author.controller';
import { BookController } from './goodread/book.controller';
import { GoodreadService } from './goodread/goodread.service';
import { StatusController } from './status/status.controller';
import { GoodReadRepository } from './storage/goodread';

@Module({
  imports: [],
  controllers: [StatusController, AuthorController, BookController],
  providers: [GoodReadRepository, GoodreadService],
})
export class AppModule {}
