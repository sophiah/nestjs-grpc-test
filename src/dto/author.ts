/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { Observable } from 'rxjs';

export const protobufPackage = 'GoodreadAuthor';

export interface Author {
  authorId: string;
  name: string;
  averageRating: number;
}

export interface Authors {
  authors: Author[];
}

export interface GetAuthorByIdsRequest {
  authorIds: string[];
}

export const GOODREAD_AUTHOR_PACKAGE_NAME = 'GoodreadAuthor';

export interface AuthorServiceClient {
  GetAuthors(request: GetAuthorByIdsRequest): Observable<Authors>;
}

export interface AuthorServiceController {
  GetAuthors(
    request: GetAuthorByIdsRequest,
  ): Promise<Authors> | Observable<Authors> | Authors;
}

export function AuthorServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['GetAuthors'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('AuthorService', method)(
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
      GrpcStreamMethod('AuthorService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const AUTHOR_SERVICE_NAME = 'AuthorService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
