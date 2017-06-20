import { Injectable } from '@angular/core';
import { Reminder,ReminderList } from '../models/reminder'
import { GoogleMapsLatLng } from 'ionic-native';
import { Events } from 'ionic-angular';


@Injectable()
export class ReminderProvider {
  private _reminders: ReminderList;

  constructor(public events: Events) {
    this._reminders = new ReminderList();
  }

  get reminders(): ReminderList {
    return this._reminders;
  }
}
