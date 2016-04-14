import {Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'timeline',
  template: require('./timeline.html'),
  styles: [require('./timeline.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent implements OnInit {

  @Input('percentage')
  percentage:Observable<number>;

  private radius:number = 98;
  private centerY:number = 100;
  private centerX:number = 100;
  private strokeDashoffset:number;
  private strokeDasharray:number = 2 * Math.PI * this.radius;

  constructor( private cdr:ChangeDetectorRef ) {

  }

  ngOnInit() {
    if (!this.percentage) {
      console.warn('TimelineComponent used without being supplied with a percentage Observable');
      return;
    }

    this.percentage.subscribe(( value:number ) => {
      this.updatePercentage(value);
      this.cdr.markForCheck();
    });
  }

  updatePercentage( value:number ) {
    let c = Math.PI * (this.radius * 2);
    this.strokeDashoffset = (1 - value) * c;
  }
}
