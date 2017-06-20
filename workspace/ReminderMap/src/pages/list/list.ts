import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { ReminderProvider } from '../../providers/reminder';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  constructor(public navCtrl: NavController, public remindersProvider: ReminderProvider,
      public events: Events) {}

  onClickRemove(rem: any) {
    this.remindersProvider.reminders.removeReminder(rem);
  }

  onClickMap(rem: any) {
    this.events.publish('centerOnReminder:map', rem);
    this.navCtrl.parent.select(0);
  }
}
