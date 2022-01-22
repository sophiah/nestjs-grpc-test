/*
 * Copy from PrometheusExporter
 */

import { diag } from '@opentelemetry/api';
import {
  ExportResult,
  globalErrorHandler,
  ExportResultCode,
  hrTimeToMicroseconds,
} from '@opentelemetry/core';
import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import * as url from 'url';
import { ExporterConfig } from './export/types';
import { PrometheusSerializer } from './PrometheusSerializer';
import { PrometheusAttributesBatcher } from './PrometheusAttributesBatcher';
import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';

export class SpanPrometheusExporter implements SpanExporter {
  static readonly DEFAULT_OPTIONS = {
    serive: 'undefined',
    host: undefined,
    port: 9464,
    endpoint: '/metrics',
    prefix: '',
    appendTimestamp: true,
    histogramBoundries: [
      30, 50, 70, 100, 200, 300, 500, 750, 1000, 1500, 2000, 3000,
    ],
  };

  private readonly _service?: string;
  private readonly _host?: string;
  private readonly _port: number;
  private readonly _endpoint: string;
  private readonly _server: Server;
  private readonly _prefix?: string;
  private readonly _appendTimestamp: boolean;
  private readonly _histogramBoundries: number[];
  private _serializer: PrometheusSerializer;
  private _batcher: PrometheusAttributesBatcher;

  // This will be required when histogram is implemented. Leaving here so it is not forgotten
  // Histogram cannot have a attribute named 'le'
  // private static readonly RESERVED_HISTOGRAM_LABEL = 'le';

  /**
   * Constructor
   * @param config Exporter configuration
   * @param callback Callback to be called after a server was started
   */
  constructor(config: ExporterConfig = {}, callback?: () => void) {
    this._service =
      config.service || SpanPrometheusExporter.DEFAULT_OPTIONS.serive;
    this._histogramBoundries =
      config.histogramBoundries ||
      SpanPrometheusExporter.DEFAULT_OPTIONS.histogramBoundries;
    this._host =
      config.host ||
      process.env.OTEL_EXPORTER_PROMETHEUS_HOST ||
      SpanPrometheusExporter.DEFAULT_OPTIONS.host;
    this._port =
      config.port ||
      Number(process.env.OTEL_EXPORTER_PROMETHEUS_PORT) ||
      SpanPrometheusExporter.DEFAULT_OPTIONS.port;
    this._prefix =
      config.prefix || SpanPrometheusExporter.DEFAULT_OPTIONS.prefix;
    this._appendTimestamp =
      typeof config.appendTimestamp === 'boolean'
        ? config.appendTimestamp
        : SpanPrometheusExporter.DEFAULT_OPTIONS.appendTimestamp;
    // unref to prevent prometheus exporter from holding the process open on exit
    this._server = createServer(this._requestHandler).unref();
    this._serializer = new PrometheusSerializer(
      this._prefix,
      this._appendTimestamp,
    );

    this._endpoint = (
      config.endpoint || SpanPrometheusExporter.DEFAULT_OPTIONS.endpoint
    ).replace(/^([^/])/, '/$1');

    if (config.preventServerStart !== true) {
      this.startServer()
        .then(callback)
        .catch((err) => diag.error(err));
    } else if (callback) {
      callback();
    }

    this._batcher = new PrometheusAttributesBatcher(
      this._service,
      this._histogramBoundries,
    );
  }

  /**
   * Saves the current values of all exported so that
   * they can be pulled by the Prometheus backend.
   *
   * In its current state, the exporter saves the current values of all metrics
   * when export is called and returns them when the export endpoint is called.
   * In the future, this should be a no-op and the exporter should reach into
   * the metrics when the export endpoint is called. As there is currently no
   * interface to do this, this is our only option.
   *
   * @param records Metrics to be sent to the prometheus backend
   * @param cb result callback to be called on finish
   */
  export(spans: ReadableSpan[], cb: (result: ExportResult) => void): void {
    if (!this._server) {
      // It is conceivable that the _server may not be started as it is an async startup
      // However unlikely, if this happens the caller may retry the export
      cb({ code: ExportResultCode.FAILED });
      return;
    }

    diag.debug('Prometheus exporter export');

    this._batcher.process(spans);

    cb({ code: ExportResultCode.SUCCESS });
  }

  /**
   * Shuts down the export server and clears the registry
   */
  shutdown(): Promise<void> {
    return this.stopServer();
  }

  /**
   * Stops the Prometheus export server
   */
  stopServer(): Promise<void> {
    if (!this._server) {
      diag.debug(
        'Prometheus stopServer() was called but server was never started.',
      );
      return Promise.resolve();
    } else {
      return new Promise((resolve) => {
        this._server.close((err) => {
          if (!err) {
            diag.debug('Prometheus exporter was stopped');
          } else {
            if (
              (err as unknown as { code: string }).code !==
              'ERR_SERVER_NOT_RUNNING'
            ) {
              globalErrorHandler(err);
            }
          }
          resolve();
        });
      });
    }
  }

  /**
   * Starts the Prometheus export server
   */
  startServer(): Promise<void> {
    return new Promise((resolve) => {
      this._server.listen(
        {
          port: this._port,
          host: this._host,
        },
        () => {
          diag.debug(
            `Prometheus exporter server started: ${this._host}:${this._port}/${this._endpoint}`,
          );
          resolve();
        },
      );
    });
  }

  /**
   * Request handler that responds with the current state of metrics
   * @param request Incoming HTTP request of server instance
   * @param response HTTP response objet used to response to request
   */
  public getMetricsRequestHandler(
    _request: IncomingMessage,
    response: ServerResponse,
  ): void {
    this._exportMetrics(response);
  }

  /**
   * Request handler used by http library to respond to incoming requests
   * for the current state of metrics by the Prometheus backend.
   *
   * @param request Incoming HTTP request to export server
   * @param response HTTP response object used to respond to request
   */
  private _requestHandler = (
    request: IncomingMessage,
    response: ServerResponse,
  ) => {
    if (url.parse(request.url!).pathname === this._endpoint) {
      this._exportMetrics(response);
    } else {
      this._notFound(response);
    }
  };

  /**
   * Responds to incoming message with current state of all metrics.
   */
  private _exportMetrics = (response: ServerResponse) => {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/plain');
    if (!this._batcher.hasMetric) {
      response.end('# no registered metrics');
      return;
    }
    response.end(this._serializer.serialize(this._batcher.checkPointSet()));
  };

  /**
   * Responds with 404 status code to all requests that do not match the configured endpoint.
   */
  private _notFound = (response: ServerResponse) => {
    response.statusCode = 404;
    response.end();
  };
}
