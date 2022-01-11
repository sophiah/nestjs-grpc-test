import time
import uuid

import grpc
from locust import task
from locust import User
from locust import TaskSet

from protos.author_pb2_grpc import AuthorServiceStub
from protos import author_pb2

class AuthorServiceClient:
    GetAuthorByIdsRequest = author_pb2.GetAuthorByIdsRequest

    def __init__(self) -> None:
        self.host = "localhost:18082"
        self.channel = grpc.insecure_channel(self.host)
    
    def get_authors(self, request: author_pb2.GetAuthorByIdsRequest) -> author_pb2.Authors:
        stub = AuthorServiceStub(self.channel).GetAuthors
        resp, call = stub.with_call(request=request, metadata=self.get_grpc_metadata())
        # print(call)
        # print(resp)

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
    def say_hello(self):
        req_data = author_pb2.GetAuthorByIdsRequest(author_ids=['1077326'])
        self.locust_request_handler("GetAuthorByIdsRequest", req_data)

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
        }
        if grpc_name not in req_func_map:
            raise ValueError(f"gRPC name not supported [{grpc_name}]")
        return req_func_map[grpc_name]


class AuthorTest(User):
    tasks = [PerfTaskSet]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client = AuthorServiceClient()