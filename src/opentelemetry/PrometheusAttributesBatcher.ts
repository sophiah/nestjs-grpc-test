import { AggregationTemporality, Attributes, ValueType } from '@opentelemetry/api-metrics';
import { Resource, ResourceAttributes } from '@opentelemetry/resources';
import { HistogramMetric, UngroupedProcessor } from '@opentelemetry/sdk-metrics-base';
import { BoundHistogram } from '@opentelemetry/sdk-metrics-base';
import { MetricKind } from '@opentelemetry/sdk-metrics-base';
import {
  MetricRecord,
  MetricDescriptor,
  AggregatorKind,
} from '@opentelemetry/sdk-metrics-base';
import { ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { PrometheusCheckpoint } from './types';

interface BatcherCheckpoint {
  descriptor: MetricDescriptor;
  aggregatorKind: AggregatorKind;
  records: Map<string, MetricRecord>;
}

export class PrometheusAttributesBatcher {
  private _batchMap = new Map<string, BatcherCheckpoint>();
  private _histogramBound = new Map<string, BoundHistogram>();
  private _histogramBoundries: number[];
  private _histogram: HistogramMetric;
  private _service: string;

  constructor(service: string, histogramBoundries: number[]) {
    this._service = service;
    this._histogramBoundries = histogramBoundries;
    this._histogram = new HistogramMetric(
      this._service,
      {
        component: this._service,
        description: this._service,
        boundaries: this._histogramBoundries,
        aggregationTemporality:
          AggregationTemporality.AGGREGATION_TEMPORALITY_UNSPECIFIED,
      },
      new UngroupedProcessor(),
      new Resource({ service: this._service }),
      { name: 'SpanPrometheusExporter' },
    );
  }

  get hasMetric(): boolean {
    return this._batchMap.size > 0;
  }

  private getSpanAttributes(span: ReadableSpan): Attributes {
    const attrs = {};
    Object.keys(span.attributes).forEach((k) => {
      attrs[k] = span.attributes[k].toString();
    });
    return attrs;
  }

  private getSpanResourceAttributes(span: ReadableSpan): ResourceAttributes {
    const attrs: ResourceAttributes = {};
    attrs['service'] = this._service;
    Object.keys(span.attributes).forEach((k) => {
      attrs[k] = span.attributes[k].toString();
    });
    return attrs;
  }

  private async spanDuration(
    span: ReadableSpan,
    span_name: string,
    span_attribute: string,
  ): Promise<void> {
    const histogram_key = `${span_name}_${span_attribute}`;
    let _x_histogram = this._histogramBound.get(histogram_key);
    if (_x_histogram == undefined) {
      _x_histogram = this._histogram.bind(this.getSpanAttributes(span));
      this._histogramBound.set(histogram_key, _x_histogram);
    }
    _x_histogram.record(span.duration[1] / 1000000);
  }

  async process(spans: ReadableSpan[]): Promise<void> {
    /**
     * countKey => counterAttributes[]
     */
    const _keysMap = new Map<string, Set<string>>();
    for (const span of spans) {
      const _spanName = span.name;
      const _spanAttribute = Object.keys(span.attributes)
        .map((k) => `${k}=${span.attributes[k]}`)
        .join(',');
      if (_keysMap.get(_spanName) == undefined) {
        _keysMap.set(_spanName, new Set<string>());
      }
      _keysMap.get(_spanName).add(`${_spanName}_${_spanAttribute}`);

      await this.spanDuration(span, `duration_${_spanName}`, _spanAttribute);
    }

    // for (const _recordKey of _keysMap.keys()) {
    //   let batcher_cpt = this._batchMap.get(`duration_${_recordKey}`);
    //   if (batcher_cpt === undefined) {
    //     batcher_cpt = {
    //       descriptor: {
    //         name: `duration_${_recordKey}`,
    //         description: `duration_${_recordKey}`,
    //         unit: '1',
    //         metricKind: MetricKind.HISTOGRAM,
    //         valueType: ValueType.DOUBLE,
    //       },
    //       aggregatorKind: AggregatorKind.HISTOGRAM,
    //       records: new Map(),
    //     };
    //     this._batchMap.set(`duration_${_recordKey}`, batcher_cpt);
    //   }

    //   // for (const _spanAttribute of _keysMap.get(_recordKey)) {
    //   //   const histogram = this._histogramBound.get(`duration_${_spanAttribute}`);
    //   //   (await histogram.getMetricRecord()).forEach((x) => {
    //   //     batcher_cpt.records.set(_spanAttribute, x);
    //   //   });
    //   // }
    // }
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
