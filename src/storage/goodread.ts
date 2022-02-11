import mongoose = require('mongoose');
import { Connection, Model, Schema, Document } from 'mongoose';
import AuthorModel, {
  AuthorDocument,
  AuthorSchema,
  AUTHOR_COLLECTION,
} from './schema/AuthorModel';
import BookModel, {
  BookDocument,
  BookSchema,
  BOOK_COLLECTION,
} from './schema/BookModel';

const GOODREAD_CONN_STR = process.env['GOODREAD_CONNSTR'];
const GOODREAD_DB = process.env['GOODREAD_DB'] || 'goodread';

export class GoodReadRepository {
  constructor(
    private readonly mongoseConn: Connection = mongoose.createConnection(
      GOODREAD_CONN_STR,
      {
        user: process.env['GOODREAD_USR'],
        pass: process.env['GOODREAD_PWD'],
      },
    ),
  ) {
    this.mongoseConn = this.mongoseConn.useDb(GOODREAD_DB);
  }

  private async getModel<T extends Document>(
    name: string,
    schema: Schema<T>,
  ): Promise<Model<T>> {
    const conn: Connection = await this.mongoseConn;
    return conn.model(name, schema);
  }

  private authorModel = null;
  private async getAuthorModel(): Promise<Model<AuthorDocument>> {
    if (!this.authorModel) {
      this.authorModel = await this.getModel<AuthorDocument>(
        AUTHOR_COLLECTION,
        AuthorSchema,
      );
    }
    return this.authorModel;
  }

  private bookModel = null;
  private async getBookModel(): Promise<Model<BookDocument>> {
    if (!this.bookModel) {
      this.bookModel = await this.getModel<BookDocument>(
        BOOK_COLLECTION,
        BookSchema,
      );
    }
    return this.bookModel;
  }

  public async queryBooks(ids: string[]): Promise<BookModel[]> {
    return this.getBookModel().then((model) =>
      model.find({ book_id: { $in: ids } }),
    );
  }

  public async queryAuthors(ids: string[]): Promise<AuthorModel[]> {
    return this.getAuthorModel().then((model) =>
      model.find({ author_id: { $in: ids } }),
    );
  }

  public async queryBooksByAuthorIds(ids: string[]): Promise<BookModel[]> {
    return this.getBookModel().then((model) =>
      model.find({ 'authors.author_id': { $in: ids } }),
    );
  }
}
