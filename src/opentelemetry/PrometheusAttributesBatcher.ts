import {
  AggregationTemporality,
  Attributes,
  Histogram,
  ValueType,
} from '@opentelemetry/api-metrics';
import {
  Meter,
  MeterProvider,
  MetricKind,
  Processor,
  UngroupedProcessor,
} from '@opentelemetry/sdk-metrics-base';
import { MetricRecord } from '@opentelemetry/sdk-metrics-base';
import { ReadableSpan } from '@opentelemetry/sdk-trace-base';


export class PrometheusAttributesBatcher {
  private _histogram = new Map<string, Histogram>();
  private _histogramBoundries: number[];
  private _service: string;
  private _meter: Meter;
  private _hasRecord = false;
  private _processor: Processor;

  constructor(service: string, histogramBoundries: number[]) {
    this._service = service;
    this._histogramBoundries = histogramBoundries;
    this._processor = new UngroupedProcessor();
    this._processor.aggregatorFor({
      name: 'duration',
      description: 'execution duration',
      unit: 'milliseconds',
      metricKind: MetricKind.HISTOGRAM,
      valueType: ValueType.DOUBLE,
      boundaries: this._histogramBoundries,
    });
    this._meter = new MeterProvider({ processor: this._processor }).getMeter(
      service,
    );
  }

  get hasMetric(): boolean {
    return this._hasRecord;
  }

  private getSpanAttributes(span: ReadableSpan): Attributes {
    const attrs = {};
    attrs['service'] = this._service;
    Object.keys(span.attributes).forEach((k) => {
      attrs[k] = span.attributes[k].toString();
    });
    return attrs;
  }

  private async spanDuration(span: ReadableSpan): Promise<void> {
    const histogram_name = span.name.replace('/', '_');
    let histogram: Histogram = this._histogram.get(histogram_name);
    if (histogram == undefined) {
      histogram = this._meter.createHistogram(histogram_name, {
        component: this._service,
        description: histogram_name,
        boundaries: this._histogramBoundries,
        aggregationTemporality:
          AggregationTemporality.AGGREGATION_TEMPORALITY_UNSPECIFIED,
      });
      this._histogram.set(histogram_name, histogram);
      this._hasRecord = true;
    }
    histogram.record(span.duration[1] / 1000000, this.getSpanAttributes(span));
  }

  processSpan(spans: ReadableSpan[]) {
    for (const span of spans) {
      this.spanDuration(span);
    }
    this._meter.collect();
  }

  checkPointSet(): MetricRecord[] {
    return this._processor.checkPointSet();
  }
}
