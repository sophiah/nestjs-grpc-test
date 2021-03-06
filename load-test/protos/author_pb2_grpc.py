# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import author_pb2 as author__pb2


class AuthorServiceStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.GetAuthors = channel.unary_unary(
                '/GoodreadAuthor.AuthorService/GetAuthors',
                request_serializer=author__pb2.GetAuthorByIdsRequest.SerializeToString,
                response_deserializer=author__pb2.Authors.FromString,
                )


class AuthorServiceServicer(object):
    """Missing associated documentation comment in .proto file."""

    def GetAuthors(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_AuthorServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'GetAuthors': grpc.unary_unary_rpc_method_handler(
                    servicer.GetAuthors,
                    request_deserializer=author__pb2.GetAuthorByIdsRequest.FromString,
                    response_serializer=author__pb2.Authors.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'GoodreadAuthor.AuthorService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class AuthorService(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def GetAuthors(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/GoodreadAuthor.AuthorService/GetAuthors',
            author__pb2.GetAuthorByIdsRequest.SerializeToString,
            author__pb2.Authors.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
