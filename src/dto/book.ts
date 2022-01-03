/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { Observable } from 'rxjs';

export const protobufPackage = 'GoodreadBook';

export interface AuthorBook {
  authorId: string;
  role: string;
}

export interface Book {
  bookId: string;
  title: string;
  description: string;
  isbn: string;
  asin: string;
  link: string;
  authors: AuthorBook[];
  similarBooks: string[];
  averageRating: number;
}

export interface BookList {
  books: Book[];
}

export interface GetBookByIdsRequest {
  bookIds: string[];
}

export interface GetBookByAuthorIdsRequest {
  authorIds: string[];
}

export const GOODREAD_BOOK_PACKAGE_NAME = 'GoodreadBook';

export interface BookServiceClient {
  GetBooks(request: GetBookByIdsRequest): Observable<BookList>;

  GetBooksByAuthor(request: GetBookByAuthorIdsRequest): Observable<BookList>;
}

export interface BookServiceController {
  GetBooks(
    request: GetBookByIdsRequest,
  ): Promise<BookList> | Observable<BookList> | BookList;

  GetBooksByAuthor(
    request: GetBookByAuthorIdsRequest,
  ): Promise<BookList> | Observable<BookList> | BookList;
}

export function BookServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['GetBooks', 'GetBooksByAuthor'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('BookService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('BookService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const BOOK_SERVICE_NAME = 'BookService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
