import {Component, ElementRef, OnInit, Input, ChangeDetectionStrategy} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
var alertify = require('alertify.js');

import {PlaylistService} from "../../service/playlist.service.ts";
import {Playlist} from "../../model/playlist";

import {ProviderEnum} from "../../model/enum/provider.enum.ts";
import {SpotifyService} from "../../service/spotify.service.ts";

// Change to Component and transclude drop-url-overlay
@Component({
  selector: 'drop-url',
  template: require('./drop-url.html'),
  styles: [require('./drop-url.scss')],
  host: {
    '(drop)': 'handleDrop($event)',
    '(dragover)': 'handleDragOver($event)',
    '(dragend)': 'handleDragEnd($event)',
    '(dragleave)': 'handleDragLeave($event)'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropUrlComponent implements OnInit {

  @Input('playlist')
  private playlist$:Observable<Playlist>;

  private playlist:Playlist;

  private CSS_CLASS:string = 'drop-url';
  private CSS_CLASS_ACTIVE:string = 'is-active';
  private CSS_CLASS_ACCEPTED:string = 'is-accepted';
  private CSS_CLASS_REJECTED:string = 'is-rejected';

  private isDrag:boolean = false;

  constructor( private el:ElementRef, private playlistService:PlaylistService, private spotifyService:SpotifyService ) {
    console.log('DropUrlComponent()');
  }

  ngOnInit() {
    this.el.nativeElement.classList.add(this.CSS_CLASS);
    this.playlist$.subscribe(playlist => this.playlist = playlist);
  }

  handleDragOver( event ) {
    // console.log('DropUrlComponent.handleDragOver()', event.dataTransfer);
    event.preventDefault();

    if (this.isDrag) {
      return;
    }

    this.isDrag = true;
    this.el.nativeElement.classList.add(this.CSS_CLASS_ACTIVE);
  }

  handleDrop( event ) {
    // console.log('DropUrlComponent.handleDrop()', event, event.dataTransfer.getData("URL"));
    event.preventDefault();

    this.isDrag = false;

    const url = event.dataTransfer.getData("URL");

    const isValid = this.spotifyService.isValidSpotifyUrl(url);

    const validatorClass = isValid
      ? this.CSS_CLASS_ACCEPTED
      : this.CSS_CLASS_REJECTED;

    this.el.nativeElement.classList.add(validatorClass);

    if (!isValid) {
      return;
    }

    const spotifyUri = this.spotifyService.linkToSpotifyUri(url);
    console.info('DropUrlComponent.drop: ACCEPTED', spotifyUri, this.playlist);
    this.playlistService.addTrack(this.playlist, ProviderEnum.SPOTIFY, spotifyUri)
      .subscribe(
        ( status:number ) => {
          console.log('DropUrlComponent.subscribe(): status:', status);
          // TODO: Not showing in ui
          this.hideOverlay();
        },
        ( error:any ) => {
          console.error('DropUrlComponent.subscribe(): error:', error);
          alertify.error('Sorry, there was a problem adding your track.');
        }
      );

    // TODO: Show error notification if error
  }

  handleDragEnd( event ) {
    // console.log('DropUrlComponent.handleDragEnd()', event);
    event.preventDefault();

    this.hideOverlay();
  }

  handleDragLeave( event ) {
    // console.log('DropUrlComponent.dragLeave()', event);
    event.preventDefault();

    this.hideOverlay();
  }

  hideOverlay() {
    this.isDrag = false;
    this.el.nativeElement.classList.remove(
      this.CSS_CLASS_ACTIVE,
      this.CSS_CLASS_ACCEPTED,
      this.CSS_CLASS_REJECTED
    );
  }


}
