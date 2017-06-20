import { Component, ElementRef, ViewChild, AfterViewInit, trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('skyState', [
      state('day', style({
        backgroundColor: '#00BFFF'
      })),
      state('night',   style({
        backgroundColor: '#131862'
      })),
      transition('day <=> night', animate('1s')),
    ]),
    trigger('flyInOut', [
      transition('void => *', [
        style({top: '-100%'}),
        animate('1s')
      ]),
      transition('* => void', [
        animate('1s', style({top: '100%'}))
      ])
    ]),
    trigger('birdState', [
      state('day', style({
        'background-image': 'url(./assets/landscape/bird.png)',
        'animation-name': 'spin',
        'animation-duration': '6s'
      })),
      state('night',   style({
        'background-image': 'url(./assets/landscape/owl.png)',
        'animation-name': 'jump',
        'animation-duration': '3s'
      })),
      transition('day <=> night', animate('0.5s 0.5s')),
    ]),
  ]
})
export class HomePage implements AfterViewInit {
  state: string = 'day';

  @ViewChild('landscape') landscapeElement:ElementRef;
  maxDeltaX:number;
  currentDeltaX: number;
  lastPanDeltaX: number = 0;

  audio: any;

  ngAfterViewInit() {
    var landWidth = this.landscapeElement.nativeElement.clientWidth;
    var screenWidth = this.landscapeElement.nativeElement.parentElement.clientWidth;
    this.maxDeltaX = (landWidth - screenWidth) * -1;
    this.currentDeltaX = this.maxDeltaX / 2;
  }

  panEvent(e) {
    if (e.eventType == 4) {
      this.lastPanDeltaX = 0;
      return true;
    };
    var dx = e.deltaX - this.lastPanDeltaX;
    this.lastPanDeltaX = e.deltaX;

    if ((this.currentDeltaX + dx) < this.maxDeltaX || (this.currentDeltaX + dx) > 0) {
      return true;
    }
    this.currentDeltaX += dx;

    return true;
  }

  constructor(public navCtrl: NavController) {

  }
  toogleState() {
    console.log("Current state: " + this.state);
    this.state = 'day' == this.state ? 'night' : 'day';
    console.log("New state: " + this.state);
  }


  playAudio() {
    if (this.audio) {
      this.audio.pause();
    }
    this.audio = 'day' == this.state ? new Audio('./assets/sounds/bird.mp3') : new Audio('../assets/sounds/owl.mp3');
    this.audio.play();
  }
}
