import { Component } from '@angular/core';

class State {
  name:  string;
  duration:  number;

  constructor(name: string, duration: number) {
    this.name = name;
    this.duration = duration;
  }
}

var POMODORO_STATE: State = new State('Pomodoro', 25*60)
var SHORT_BREAK_STATE: State = new State('Short Break', 5*60)
var LONG_BREAK_STATE: State = new State('Long Break', 15*60)

var STATE_LIFE_CICLE: State[] = [
  POMODORO_STATE,
  SHORT_BREAK_STATE,
  POMODORO_STATE,
  SHORT_BREAK_STATE,
  POMODORO_STATE,
  SHORT_BREAK_STATE,
  POMODORO_STATE,
  SHORT_BREAK_STATE,
  LONG_BREAK_STATE
]


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  is_running: boolean;
  seconds: number;
  state_idx: number;
  start_pause_label: string;
  start_pause_icon: string;

  constructor() {
    this.is_running = false;
    this.state_idx = 0;
    this.seconds = STATE_LIFE_CICLE[this.state_idx].duration;
    this.start_pause_label = this.is_running ? "Pause" : "Start";
    this.start_pause_icon = this.is_running ? "pause" : "play";

    setInterval(() => {
      this.tick();
    }, 1000);
  };

  tick(): void {
    if (this.is_running) {
      this.seconds--;
    }
    if(this.seconds <= 0) {
      this.next_state();
    }
  }

  toggle(): void {
    this.is_running = !this.is_running;
    this.start_pause_label = this.is_running ? "Pause" : "Start";
    this.start_pause_icon = this.is_running ? "pause" : "play";
  };

  stop(): void {
    this.is_running = false;
    this.state_idx = 0;
    this.seconds = STATE_LIFE_CICLE[this.state_idx].duration;
  };

  next_state(): void {
    this.state_idx++;
    if (this.state_idx == STATE_LIFE_CICLE.length) { this.state_idx = 0}
    this.seconds = STATE_LIFE_CICLE[this.state_idx].duration;
  }

  get STATE_LIFE_CICLE(): State[] {
    return STATE_LIFE_CICLE;
  }
}
