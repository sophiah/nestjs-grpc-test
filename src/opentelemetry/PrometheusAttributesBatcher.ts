import {
  AggregationTemporality,
  Attributes,
  ValueType,
} from '@opentelemetry/api-metrics';
import { Resource, ResourceAttributes } from '@opentelemetry/resources';
import { CounterMetric, HistogramAggregator, HistogramMetric } from '@opentelemetry/sdk-metrics-base';
import { UngroupedProcessor } from '@opentelemetry/sdk-metrics-base';
import { MetricKind, SumAggregator } from '@opentelemetry/sdk-metrics-base';
import {
  MetricRecord,
  MetricDescriptor,
  AggregatorKind,
} from '@opentelemetry/sdk-metrics-base';
import { ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { Aggregate } from 'mongoose';
import { PrometheusCheckpoint } from './types';

interface BatcherCheckpoint {
  descriptor: MetricDescriptor;
  aggregatorKind: AggregatorKind;
  records: Map<string, MetricRecord>;
}

export class PrometheusAttributesBatcher {
  private _batchMap = new Map<string, BatcherCheckpoint>();
  private _counter = new Map<string, CounterMetric>();
  private _histogram = new Map<string, HistogramMetric>();
  private _histogramBoundries: number[];
  private _service: string;

  constructor(service: string, histogramBoundries: number[]) {
    this._service = service;
    this._histogramBoundries = histogramBoundries;
  }

  get hasMetric(): boolean {
    return this._batchMap.size > 0;
  }

  private getSpanAttributes(span: ReadableSpan): Map<string, string> {
    return new Map(
      Object.keys(span.attributes).map( k => [k, span.attributes[k].toString()])
    )
  }

  private getSpanResourceAttributes(span: ReadableSpan): ResourceAttributes {
    const attrs: ResourceAttributes = {};
    Object.keys(span.attributes).forEach((k) => {
      attrs[k] = span.attributes[k].toString();
    });
    return attrs;
  }

  private _spanToCountDescriptor(span: ReadableSpan): MetricDescriptor {
    return {
      name: `count_${span.name}`,
      description: `count_${span.name}`,
      unit: 'count',
      metricKind: MetricKind.COUNTER,
      valueType: ValueType.INT,
    }
  }

  private async spanToCount(span: ReadableSpan): Promise<void> {
    const name = `count_${span.name}`;
    let item = this._batchMap.get(name);
    if (item === undefined) {
      item = {
        descriptor: this._spanToCountDescriptor(span),
        aggregatorKind: AggregatorKind.SUM,
        records: new Map(),
      };
      this._batchMap.set(name, item);
    }
    const recordMap = item.records;
    const attributes = Object.keys(span.attributes)
      .map((k) => `${k}=${span.attributes[k]}`)
      .join(',');
    let counter = this._counter.get(attributes);
    if (counter == undefined) {
      counter = new CounterMetric(
        name,
        {
          component: this._service,
          description: name,
        },
        new UngroupedProcessor(),
        new Resource(this.getSpanResourceAttributes(span)),
        { name: 'SpanPrometheusExporter' },
      );
      this._counter.set(attributes, counter);
    }
    (await counter.getMetricRecord()).forEach((x) => {
      recordMap.set(attributes, x);
    });
    counter.add(1);
  }

  private _spanToDurationDescriptor(span: ReadableSpan): MetricDescriptor {
    return {
      name: `duration_${span.name}`,
      description: `duration - ${span.name}`,
      unit: 'microsecond',
      metricKind: MetricKind.HISTOGRAM,
      valueType: ValueType.INT,
    };
  }

  private async spanToDuration(span: ReadableSpan): Promise<void> {
    const name = `duration_${span.name}`;
    let item = this._batchMap.get(name);
    if (item === undefined) {
      item = {
        descriptor: this._spanToDurationDescriptor(span),
        aggregatorKind: AggregatorKind.HISTOGRAM,
        records: new Map(),
      };
      this._batchMap.set(name, item);
    }
    const recordMap = item.records;
    const attributes = Object.keys(span.attributes)
      .map((k) => `${k}=${span.attributes[k]}`)
      .join(',');

    let histogram = this._histogram.get(attributes);
    if (histogram == undefined) {
      histogram = new HistogramMetric(
        name,
        {
          component: this._service,
          description: name,
          constantAttributes: this.getSpanAttributes(span),
          boundaries: this._histogramBoundries,
        },
        new UngroupedProcessor(),
        new Resource(this.getSpanResourceAttributes(span)),
        { name: 'SpanPrometheusExporter' },
      );
      this._histogram.set(attributes, histogram);
    }
    (await histogram.getMetricRecord()).forEach((x) => {
      recordMap.set(attributes, x);
    });
    histogram.record(span.duration[1] / 1000000);
  }

  process(span: ReadableSpan): void {
    span.attributes['service'] = this._service;
    this.spanToCount(span);
    this.spanToDuration(span);
  }

  checkPointSet(): PrometheusCheckpoint[] {
    return Array.from(this._batchMap.values()).map(
      ({ descriptor, aggregatorKind, records }) => {
        return {
          descriptor,
          aggregatorKind,
          records: Array.from(records.values()),
        };
      },
    );
  }
}
