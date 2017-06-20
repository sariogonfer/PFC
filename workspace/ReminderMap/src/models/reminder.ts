import {GoogleMapsLatLng, Geofence, SQLite} from 'ionic-native';
import {EventEmitter} from '@angular/core';

var RADIUS: number = 100;


export class ReminderList {
  private _db: SQLite;
  private _reminders: Array<Reminder>;
  onUpdate: EventEmitter<Array<Reminder>> = new EventEmitter();

  constructor() {
    this._db = new SQLite();
    this._db.openDatabase({
      name: 'reminder.db',
      location: 'default'
    }).then(() => {
      this._db.executeSql('CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY,' +
        'name VARCHAR(16), description VARCHAR(512), lat FLOAT, lng FLOAT)', []
      ).then((data) => {
          this.refresh();
      }, (err) => {
        console.error('Unable to execute sql: ', err);
      });
    }, (err) => {
      console.error('Unable to open database: ', err);
    });
  }

  all(): Array<Reminder> {
    return this._reminders;
  }

  refresh() {
    this._reminders = [];
    this._db.executeSql('SELECT * FROM reminders', []).then(
      (data) => {
          for (let i = 0; i < data.rows.length; i++) {
            let item = data.rows.item(i);
            this._reminders.push(new Reminder(item.name, item.description,
              [item.lat, item.lng], item.id))
          }

          this.onUpdate.emit(this._reminders);
      }, (err) => {
        console.error('Unable to execute sql: ', err);
      }
    )
  }

  addReminder(name: string, description: string, latLng: GoogleMapsLatLng) {
    let rem = new Reminder(name, description, latLng);
    rem.save(this._db);
    this.refresh();

    return rem;
  }

  removeReminder(rem: Reminder) {
    rem.remove(this._db);
    this.refresh()

    return rem;
  }
}

export class Reminder {
  private _id: number;
  private _name: string;
  private _description: string;
  private _lat: number;
  private _lng: number;

  constructor(name: string, description: string, latLng: GoogleMapsLatLng | Array<number>, id: number=null) {
    this._id = id;
    this.name = name;
    this.description = description;
    if (latLng instanceof Array) {
      this._lat = latLng[0];
      this._lng = latLng[1];
    } else {
      this._lat = latLng['lat'];
      this._lng = latLng['lng'];
    }
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name.substr(0, 16);
  }

  get description(): string {
    return this._description;
  }

  set description(description: string) {
    this._description = description.substr(0, 512);
  }

  get latLng(): GoogleMapsLatLng {
    return new GoogleMapsLatLng(this._lat, this._lng);
  }

  set latLng(latLng: GoogleMapsLatLng ) {
    this._lat = latLng['lat'];
    this._lng = latLng['lng'];
  }

  save(db) {
    db.executeSql('INSERT INTO reminders (name, description, lat, lng) VALUES (?, ?, ?, ?)',
      [this._name, this._description, this._lat, this._lng]).then(
        (data) => {
            this._id = data.insertId;
            this.createAssociatedGeoFence();
        }, (err) => {
          console.error('Unable to execute sql: ', err);

          return err
        }
      )
    return this;
  }

  remove(db) {
    if (!this._id) {
      return this;
    }
    db.executeSql('DELETE FROM reminders WHERE id = ?', [this._id]).then(
        (data) => {
          this.removeAssociatedGeoFence();
          this._id = null;
        }, (err) => {
          console.error('Unable to execute sql: ', err);

          return err
        }
      )
    return this;
  }


  createAssociatedGeoFence() {
    let fence = {
      id: this._id.toString(),
      latitude: this._lat,
      longitude: this._lng,
      radius: RADIUS,
      transitionType: 1, // Enter transition
      notification: {
          id:             1,
          title:          this._name,
          text:           this._description,
          openAppOnClick: true
      }
    }

    Geofence.addOrUpdate(fence).then(
     () => console.log('Geofence added'),
     (err) => console.log(err)
   );
  }

  removeAssociatedGeoFence() {
    Geofence.remove(this._id.toString()).then(
     () => console.log('Geofence removed'),
     (err) => console.log('Geofence failed to remove')
   );
  }
}
