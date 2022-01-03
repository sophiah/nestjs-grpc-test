import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GoodreadService } from './goodread.service';
import {
  BookList,
  BookServiceController,
  BookServiceControllerMethods,
  GetBookByAuthorIdsRequest,
  GetBookByIdsRequest,
  GOODREAD_BOOK_PACKAGE_NAME,
} from 'src/dto/book';

@Controller(GOODREAD_BOOK_PACKAGE_NAME)
@BookServiceControllerMethods()
export class BookController implements BookServiceController {
  constructor(private goodreadService: GoodreadService) {}
  GetBooks(
    request: GetBookByIdsRequest,
  ): BookList | Promise<BookList> | Observable<BookList> {
    return this.goodreadService.getBookByIds(request.bookIds);
  }

  GetBooksByAuthor(
    request: GetBookByAuthorIdsRequest,
  ): BookList | Promise<BookList> | Observable<BookList> {
    return this.goodreadService.getBookByAuthorIds(request.authorIds);
  }
}
