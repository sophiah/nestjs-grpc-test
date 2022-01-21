import { NodeSDK, NodeSDKConfiguration } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import * as process from 'process';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { ConsoleMetricExporter } from '@opentelemetry/sdk-metrics-base';

// import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
// import { CollectorTraceExporter } from '@opentelemetry/exporter-collector-grpc';
// const traceCollectorOptions = {
//   url: process.env['OTLP_ENDPOINT'] || 'grpc://localhost:4317',
// };
// const spanExporter = new BatchSpanProcessor(
//   new CollectorTraceExporter(traceCollectorOptions),
// );

import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { SpanPrometheusExporter } from './opentelemetry';
const spanExporter = new BatchSpanProcessor(
  new SpanPrometheusExporter({
    service: 'test-grpc',
    port: 9000,
  }),
);

// turn on the debug mode
// import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const _config: Partial<NodeSDKConfiguration> = {
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'grpc-service',
  }),
  spanProcessor: spanExporter,
  contextManager: new AsyncLocalStorageContextManager(),
};

_config.instrumentations = [new GrpcInstrumentation()];

const otelSDK = new NodeSDK(_config);

export default otelSDK;
// You can also use the shutdown method to gracefully shut down the SDK before process shutdown
// or on some operating system signal.
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
