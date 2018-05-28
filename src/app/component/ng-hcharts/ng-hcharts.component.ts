import { Component, ElementRef, Input, KeyValueDiffer, KeyValueDiffers, OnDestroy, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'ng-hcharts',
  template: ''
})
export class NgHchartsComponent implements OnDestroy, OnChanges {
  hostElement: ElementRef;
  differ: KeyValueDiffer<any, any>;
  constructor(private el: ElementRef, _differs: KeyValueDiffers) {
    this.hostElement = el;
    this.differ = _differs.find({}).create();
  };

  chart: any;
  Highcharts: any = Highcharts;
  @Input() options: any;
  @Input() oneToOne: Boolean;
  updateValue = false;
  currentWidth: number;
  currentHeight: number;
  updateOrCreateChart():void {
    if (this.chart && this.chart.update) {
      this.chart.update(this.options, true, this.oneToOne || false);
    } else {
      this.chart = this.Highcharts['chart'](
        this.hostElement.nativeElement,
        this.options,
        null
      );
      this.options.series = this.chart.userOptions.series;
    }
  }

  ngOnChanges() {
    this.updateOrCreateChart();
    if (this.currentWidth !== this.hostElement.nativeElement.parentElement.offsetWidth) {
      this.chart.setSize(this.hostElement.nativeElement.parentElement.offsetWidth);
    }
    if (this.differ.diff(this.options)) {
      this.updateOrCreateChart();
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

}