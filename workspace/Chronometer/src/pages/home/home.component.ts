import { Component } from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private _is_running:boolean;
  seconds:number;
  start_pause_label: string;
  start_pause_icon: string;

  constructor() {
    this.is_running = false;
    this.seconds =0;

    setInterval(() => {
      this.tick();
    }, 1000);
  };

  public get is_running() {
    return this._is_running;
  };

  public set is_running(new_state) {
    this._is_running = new_state;
    this.start_pause_label = this.is_running ? "Pause" : "Start";
    this.start_pause_icon = this.is_running ? "pause" : "play";
  };

  tick(): void {
    if (this.is_running) {
      this.seconds++;
    }
  };

  toggle(): void {
    this.is_running = !this.is_running;
  };

  stop(): void {
    this.is_running = false;
    this.seconds = 0;
  };
}
