import grpc
from protos import author_pb2
from protos import author_pb2_grpc
from locust import events, User, task
from locust.exception import LocustError
from locust.user.task import LOCUST_STATE_STOPPING
import gevent
import time

host = 'localhost:18082'
channel = grpc.insecure_channel(host)

stub = author_pb2_grpc.AuthorServiceStub(channel=channel)
response = stub.GetAuthors(author_pb2.GetAuthorByIdsRequest(author_ids=['1077326']))
print(response)
