import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'sr-timeline',
  template: require('./timeline.html'),
  styles: [require('./timeline.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnChanges {

  @Input() percentage: number;

  private radius: number = 98;

  /* tslint:disable:no-unused-variable */
  private centerY: number = 100;
  private centerX: number = 100;
  private strokeDashoffset: number;
  private strokeDasharray: number = 2 * Math.PI * this.radius;
  /* tslint:enable:no-unused-variable */

  ngOnChanges() {
    if (typeof this.percentage === 'undefined' || this.percentage === null) {
      console.warn('TimelineComponent used without being supplied with a percentage');
      return;
    }

    this.draw();
  }

  draw() {
    console.log('TimelineComponent.draw:', this.percentage);
    let c = Math.PI * (this.radius * 2);
    this.strokeDashoffset = (1 - this.percentage) * c;
  }
}
