from curses import meta
from importlib.metadata import metadata
import time
import uuid

import grpc
from locust import task
from locust import User
from locust import TaskSet

from protos.author_pb2_grpc import AuthorServiceStub
from protos.book_pb2_grpc import BookServiceStub
from protos import author_pb2, book_pb2

class AuthorServiceClient:
    GetAuthorByIdsRequest = author_pb2.GetAuthorByIdsRequest

    def __init__(self) -> None:
        self.host = "localhost:8082"
        self.channel = grpc.insecure_channel(self.host)
    
    def get_authors(self, request: author_pb2.GetAuthorByIdsRequest) -> author_pb2.Authors:
        stub = AuthorServiceStub(self.channel).GetAuthors
        stub.with_call(request=request, metadata=self.get_grpc_metadata())
    
    def get_books(self, request: book_pb2.GetBookByIdsRequest) -> book_pb2.Book:
        stub = BookServiceStub(self.channel).GetBooks
        stub.with_call(request=request)

    @staticmethod
    def get_grpc_metadata():
        # request headers
        md = [
            ("authorization", "Bearer xxxxxxxxxxxxxxxx"),
        ]
        return md
    
class PerfTaskSet(TaskSet):

    def on_start(self):
        pass

    def on_stop(self):
        pass

    @task
    def getAuthorByIds(self):
        # req_data = author_pb2.GetAuthorByIdsRequest(author_ids=['1077326', '4506759', '8328883'])
        req_data = author_pb2.GetAuthorByIdsRequest(author_ids=['1077326'])
        self.locust_request_handler("GetAuthorByIdsRequest", req_data)

    # @task
    def getBookIds(self):
        req_data = book_pb2.GetBookByIdsRequest(book_ids=['30556550', '34727935', '33876465'])
        self.locust_request_handler("GetBookIds", req_data)

    def locust_request_handler(self, grpc_name, req_data):
        req_func = self._get_request_function(grpc_name)
        start = time.time()
        result = None
        try:
            result = req_func(req_data)
        except Exception as e:
            total = int((time.time() - start) * 1000)
            self.user.environment.events.request_failure.fire(
                request_type="grpc", name=grpc_name, response_time=total, response_length=0, exception=e)
        else:
            total = int((time.time() - start) * 1000)
            self.user.environment.events.request_success.fire(
                request_type="grpc", name=grpc_name, response_time=total, response_length=0)
        return result

    def _get_request_function(self, grpc_name):
        req_func_map = {
            "GetAuthorByIdsRequest": self.client.get_authors,
            # "GetBookIds": self.client.get_books,
        }
        if grpc_name not in req_func_map:
            raise ValueError(f"gRPC name not supported [{grpc_name}]")
        return req_func_map[grpc_name]


class AuthorTest(User):
    tasks = [PerfTaskSet]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client = AuthorServiceClient()