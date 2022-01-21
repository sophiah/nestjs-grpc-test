import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as grpc from 'grpc';

import {
  Authors,
  AuthorServiceController,
  AuthorServiceControllerMethods,
  GetAuthorByIdsRequest,
  GOODREAD_AUTHOR_PACKAGE_NAME,
} from 'src/dto/author';
import { GoodreadService } from './goodread.service';

@Controller(GOODREAD_AUTHOR_PACKAGE_NAME)
@AuthorServiceControllerMethods()
export class AuthorController implements AuthorServiceController {
  constructor(private goodreadService: GoodreadService) {}

  GetAuthors(
    request: GetAuthorByIdsRequest,
  ): Authors | Promise<Authors> | Observable<Authors> {
    return this.goodreadService.getAuthorByIds(request.authorIds);
  }
}
