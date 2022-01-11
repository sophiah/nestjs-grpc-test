# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: book.proto

from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor.FileDescriptor(
  name='book.proto',
  package='GoodreadBook',
  syntax='proto3',
  serialized_options=None,
  create_key=_descriptor._internal_create_key,
  serialized_pb=b'\n\nbook.proto\x12\x0cGoodreadBook\"-\n\nAuthorBook\x12\x11\n\tauthor_id\x18\x01 \x01(\t\x12\x0c\n\x04role\x18\x02 \x01(\t\"\xbf\x01\n\x04\x42ook\x12\x0f\n\x07\x62ook_id\x18\x01 \x01(\t\x12\r\n\x05title\x18\x02 \x01(\t\x12\x13\n\x0b\x64\x65scription\x18\x03 \x01(\t\x12\x0c\n\x04isbn\x18\x04 \x01(\t\x12\x0c\n\x04\x61sin\x18\x05 \x01(\t\x12\x0c\n\x04link\x18\x06 \x01(\t\x12)\n\x07\x61uthors\x18\x07 \x03(\x0b\x32\x18.GoodreadBook.AuthorBook\x12\x15\n\rsimilar_books\x18\x08 \x03(\t\x12\x16\n\x0e\x61verage_rating\x18\t \x01(\x02\"-\n\x08\x42ookList\x12!\n\x05\x62ooks\x18\x01 \x03(\x0b\x32\x12.GoodreadBook.Book\"\'\n\x13GetBookByIdsRequest\x12\x10\n\x08\x62ook_ids\x18\x01 \x03(\t\"/\n\x19GetBookByAuthorIdsRequest\x12\x12\n\nauthor_ids\x18\x01 \x03(\t2\xad\x01\n\x0b\x42ookService\x12G\n\x08GetBooks\x12!.GoodreadBook.GetBookByIdsRequest\x1a\x16.GoodreadBook.BookList\"\x00\x12U\n\x10GetBooksByAuthor\x12\'.GoodreadBook.GetBookByAuthorIdsRequest\x1a\x16.GoodreadBook.BookList\"\x00\x62\x06proto3'
)




_AUTHORBOOK = _descriptor.Descriptor(
  name='AuthorBook',
  full_name='GoodreadBook.AuthorBook',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='author_id', full_name='GoodreadBook.AuthorBook.author_id', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='role', full_name='GoodreadBook.AuthorBook.role', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=28,
  serialized_end=73,
)


_BOOK = _descriptor.Descriptor(
  name='Book',
  full_name='GoodreadBook.Book',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='book_id', full_name='GoodreadBook.Book.book_id', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='title', full_name='GoodreadBook.Book.title', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='description', full_name='GoodreadBook.Book.description', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='isbn', full_name='GoodreadBook.Book.isbn', index=3,
      number=4, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='asin', full_name='GoodreadBook.Book.asin', index=4,
      number=5, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='link', full_name='GoodreadBook.Book.link', index=5,
      number=6, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='authors', full_name='GoodreadBook.Book.authors', index=6,
      number=7, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='similar_books', full_name='GoodreadBook.Book.similar_books', index=7,
      number=8, type=9, cpp_type=9, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='average_rating', full_name='GoodreadBook.Book.average_rating', index=8,
      number=9, type=2, cpp_type=6, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=76,
  serialized_end=267,
)


_BOOKLIST = _descriptor.Descriptor(
  name='BookList',
  full_name='GoodreadBook.BookList',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='books', full_name='GoodreadBook.BookList.books', index=0,
      number=1, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=269,
  serialized_end=314,
)


_GETBOOKBYIDSREQUEST = _descriptor.Descriptor(
  name='GetBookByIdsRequest',
  full_name='GoodreadBook.GetBookByIdsRequest',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='book_ids', full_name='GoodreadBook.GetBookByIdsRequest.book_ids', index=0,
      number=1, type=9, cpp_type=9, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=316,
  serialized_end=355,
)


_GETBOOKBYAUTHORIDSREQUEST = _descriptor.Descriptor(
  name='GetBookByAuthorIdsRequest',
  full_name='GoodreadBook.GetBookByAuthorIdsRequest',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='author_ids', full_name='GoodreadBook.GetBookByAuthorIdsRequest.author_ids', index=0,
      number=1, type=9, cpp_type=9, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=357,
  serialized_end=404,
)

_BOOK.fields_by_name['authors'].message_type = _AUTHORBOOK
_BOOKLIST.fields_by_name['books'].message_type = _BOOK
DESCRIPTOR.message_types_by_name['AuthorBook'] = _AUTHORBOOK
DESCRIPTOR.message_types_by_name['Book'] = _BOOK
DESCRIPTOR.message_types_by_name['BookList'] = _BOOKLIST
DESCRIPTOR.message_types_by_name['GetBookByIdsRequest'] = _GETBOOKBYIDSREQUEST
DESCRIPTOR.message_types_by_name['GetBookByAuthorIdsRequest'] = _GETBOOKBYAUTHORIDSREQUEST
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

AuthorBook = _reflection.GeneratedProtocolMessageType('AuthorBook', (_message.Message,), {
  'DESCRIPTOR' : _AUTHORBOOK,
  '__module__' : 'book_pb2'
  # @@protoc_insertion_point(class_scope:GoodreadBook.AuthorBook)
  })
_sym_db.RegisterMessage(AuthorBook)

Book = _reflection.GeneratedProtocolMessageType('Book', (_message.Message,), {
  'DESCRIPTOR' : _BOOK,
  '__module__' : 'book_pb2'
  # @@protoc_insertion_point(class_scope:GoodreadBook.Book)
  })
_sym_db.RegisterMessage(Book)

BookList = _reflection.GeneratedProtocolMessageType('BookList', (_message.Message,), {
  'DESCRIPTOR' : _BOOKLIST,
  '__module__' : 'book_pb2'
  # @@protoc_insertion_point(class_scope:GoodreadBook.BookList)
  })
_sym_db.RegisterMessage(BookList)

GetBookByIdsRequest = _reflection.GeneratedProtocolMessageType('GetBookByIdsRequest', (_message.Message,), {
  'DESCRIPTOR' : _GETBOOKBYIDSREQUEST,
  '__module__' : 'book_pb2'
  # @@protoc_insertion_point(class_scope:GoodreadBook.GetBookByIdsRequest)
  })
_sym_db.RegisterMessage(GetBookByIdsRequest)

GetBookByAuthorIdsRequest = _reflection.GeneratedProtocolMessageType('GetBookByAuthorIdsRequest', (_message.Message,), {
  'DESCRIPTOR' : _GETBOOKBYAUTHORIDSREQUEST,
  '__module__' : 'book_pb2'
  # @@protoc_insertion_point(class_scope:GoodreadBook.GetBookByAuthorIdsRequest)
  })
_sym_db.RegisterMessage(GetBookByAuthorIdsRequest)



_BOOKSERVICE = _descriptor.ServiceDescriptor(
  name='BookService',
  full_name='GoodreadBook.BookService',
  file=DESCRIPTOR,
  index=0,
  serialized_options=None,
  create_key=_descriptor._internal_create_key,
  serialized_start=407,
  serialized_end=580,
  methods=[
  _descriptor.MethodDescriptor(
    name='GetBooks',
    full_name='GoodreadBook.BookService.GetBooks',
    index=0,
    containing_service=None,
    input_type=_GETBOOKBYIDSREQUEST,
    output_type=_BOOKLIST,
    serialized_options=None,
    create_key=_descriptor._internal_create_key,
  ),
  _descriptor.MethodDescriptor(
    name='GetBooksByAuthor',
    full_name='GoodreadBook.BookService.GetBooksByAuthor',
    index=1,
    containing_service=None,
    input_type=_GETBOOKBYAUTHORIDSREQUEST,
    output_type=_BOOKLIST,
    serialized_options=None,
    create_key=_descriptor._internal_create_key,
  ),
])
_sym_db.RegisterServiceDescriptor(_BOOKSERVICE)

DESCRIPTOR.services_by_name['BookService'] = _BOOKSERVICE

# @@protoc_insertion_point(module_scope)