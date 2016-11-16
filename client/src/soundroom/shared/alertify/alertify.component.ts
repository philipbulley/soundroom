import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';

const alertify = require('alertify.js');

@Component({
  selector: 'sr-alertify',
  template: require('./alertify.html'),
  styles: [require('./alertify.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertifyComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef, private elRef: ElementRef) {
  }

  ngOnInit() {
    alertify.logPosition("top right");
    alertify.delay(15 * 1000);
    alertify.parent(this.elRef.nativeElement);
  }
}
