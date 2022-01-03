import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const BOOK_COLLECTION = 'book';

export class BookAuthor {
  public author_id: string;
  public role: string;
}

@Schema({ collection: BOOK_COLLECTION })
export default class BookModel {
  @Prop()
  public book_id: string;
  @Prop()
  public title: string;
  @Prop()
  public description: string;
  @Prop()
  public isbn: string;
  @Prop()
  public asin: string;
  @Prop()
  public average_rating: number;
  @Prop()
  public similar_books: string[];
  @Prop()
  public link: string;
  @Prop()
  public authors: BookAuthor[];
}

export type BookDocument = BookModel & Document;

export const BookSchema = SchemaFactory.createForClass(BookModel);
