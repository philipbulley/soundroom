import {Directive, ElementRef} from 'angular2/core';

@Directive({
  selector: '[drop-url]',
  host: {
    '(drop)': 'handleDrop($event)',
    '(dragover)': 'handleDragOver($event)',
    '(dragend)': 'handleDragEnd($event)',
    '(dragleave)': 'handleDragLeave($event)'
  }
})
export class DropUrlDirective {

  private CSS_CLASS:string = 'drop-url';
  private CSS_CLASS_ACTIVE:string = 'is-active';

  private isDrag:boolean = false;

  constructor( private el:ElementRef ) {
    console.log('DropUrlDirective()');
    this.el.nativeElement.classList.add(this.CSS_CLASS);
  }

  handleDrop( event ) {
    console.log('DropUrlDirective.drop()', event, event.dataTransfer.getData("URL"));
    event.preventDefault();

    // if (!this.isDrag) {
    //   return;
    // }
    //
    this.isDrag = false;
    this.el.nativeElement.classList.remove(this.CSS_CLASS_ACTIVE);
  }

  handleDragOver( event ) {
    // console.log('DropUrlDirective.dragOver()', event);
    event.preventDefault();

    if (this.isDrag) {
      return;
    }

    event.dataTransfer.dropEffect = "link";

    this.isDrag = true;
    this.el.nativeElement.classList.add(this.CSS_CLASS_ACTIVE);
  }

  handleDragEnd( event ) {
    console.log('DropUrlDirective.dragEnd()', event);
    event.preventDefault();

    // if (!this.isDrag) {
    //   return;
    // }

    this.isDrag = false;
    this.el.nativeElement.classList.remove(this.CSS_CLASS_ACTIVE);
  }

  handleDragLeave( event ) {
    console.log('DropUrlDirective.dragLeave()', event);
    event.preventDefault();

    // if (!this.isDrag) {
    //   return;
    // }

    this.isDrag = false;
    this.el.nativeElement.classList.remove(this.CSS_CLASS_ACTIVE);
  }

}
