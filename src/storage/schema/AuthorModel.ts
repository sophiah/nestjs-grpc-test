import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const AUTHOR_COLLECTION = 'author';

@Schema({ collection: AUTHOR_COLLECTION })
export default class AuthorModel {
  @Prop()
  public author_id: string;
  @Prop()
  public name: string;
  @Prop()
  public average_rating: number;
}

export type AuthorDocument = AuthorModel & Document;

export const AuthorSchema = SchemaFactory.createForClass(AuthorModel);
