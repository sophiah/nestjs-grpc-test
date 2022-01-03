import { Injectable } from '@nestjs/common';
import { Author, Authors } from 'src/dto/author';
import { AuthorBook, Book, BookList } from 'src/dto/book';
import { GoodReadRepository } from 'src/storage/goodread';

@Injectable()
export class GoodreadService {
  constructor(private readonly goodreadRepository: GoodReadRepository) {}

  public async getAuthorByIds(ids: string[]): Promise<Authors> {
    const authors: Author[] = (
      await this.goodreadRepository.queryAuthors(ids)
    ).map((x) => {
      const author = {} as Author;
      author.authorId = x.author_id;
      author.averageRating = x.average_rating;
      author.name = x.name;
      return author;
    });
    return { authors: authors };
  }

  public async getBookByIds(ids: string[]): Promise<BookList> {
    const books: Book[] = (await this.goodreadRepository.queryBooks(ids)).map(
      (x) => {
        const book = {} as Book;
        book.bookId = x.book_id;
        book.title = x.title;
        book.description = x.description;
        book.asin = x.asin;
        book.authors = x.authors.map(
          (x) => <AuthorBook>{ authorId: x.author_id, role: x.role },
        );
        book.averageRating = x.average_rating;
        return book;
      },
    );
    return { books: books };
  }

  public async getBookByAuthorIds(ids: string[]): Promise<BookList> {
    const books: Book[] = (
      await this.goodreadRepository.queryBooksByAuthorIds(ids)
    ).map((x) => {
      const book = {} as Book;
      book.bookId = x.book_id;
      book.title = x.title;
      book.description = x.description;
      book.asin = x.asin;
      book.authors = x.authors.map(
        (x) => <AuthorBook>{ authorId: x.author_id, role: x.role },
      );
      book.averageRating = x.average_rating;
      return book;
    });
    return { books: books };
  }
}
