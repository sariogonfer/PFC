import { Component } from '@angular/core';
import { NavController, Platform, AlertController, Events } from 'ionic-angular';
import {
   GoogleMap,
   GoogleMapsEvent,
   GoogleMapsLatLng,
   GoogleMapsMarker,
   GoogleMapsMarkerOptions
} from 'ionic-native';
import { ReminderProvider } from '../../providers/reminder';
import { Reminder } from '../../models/reminder'

/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  map: GoogleMap;
  markers : Map<Reminder, GoogleMapsMarker> = new Map<Reminder, GoogleMapsMarker>();

  static getRandomColor () {
    return '#' + ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
  }

  constructor(public navCtrl: NavController, public platform: Platform, public remindersProvider: ReminderProvider, public alertCtrl: AlertController, public events: Events) {
    platform.ready().then(() => {
      this.loadMap();
    });
    events.subscribe('centerOnReminder:map', (rem) => this.centerOnReminder(rem));
  }

  loadMap() {
    let location = new GoogleMapsLatLng(40.4893538, -3.6827461);
    this.map = new GoogleMap('map', {
      'backgroundColor': 'white',
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'zoom': true
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'latLng': location,
        'tilt': 30,
        'zoom': 15,
        'bearing': 50
      }
    });

    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
        console.log('Map is ready!');
        this.drawReminderMarkers(this.remindersProvider.reminders.all());
        this.remindersProvider.reminders.onUpdate.subscribe(reminders => this.drawReminderMarkers(reminders))
    });

    this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((latLng) => {
      this.showAddNewReminderInfoWindow(latLng);
    });
  }

  showAddNewReminderInfoWindow(latLng: GoogleMapsLatLng) {
    let markerOptions: GoogleMapsMarkerOptions = {
      'position': latLng,
      'title': 'NUEVO RECORDATORIO',
      'snippet': "Click sobre mí si quieres añadir un nuevo recordatorio en esta localización.",
      'infoClick': (marker) => {
        marker.remove();
        this.showAddNewReminderPrompt(latLng);
      }
    };

    this.map.addMarker(markerOptions).then((marker: GoogleMapsMarker) => {
      marker.showInfoWindow();
    });
  }

  showAddNewReminderPrompt (latLng: GoogleMapsLatLng) {
    this.map.setClickable( false )
    let prompt = this.alertCtrl.create({
      title: 'Nuevo recordatorio',
      message: "Se creará un nuevo recordatorio para la localización seleccionada.",
      inputs: [
        {
          name: 'name',
          placeholder: 'Nombre'
        },
        {
          name: 'description',
          placeholder: 'Descripción',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Guardar',
          handler: data => {
            this.remindersProvider.reminders.addReminder(data['name'], data['description'], latLng);
          }
        }
      ]
    });
    prompt.onDidDismiss(() => this.map.setClickable( true ));
    prompt.present();
  }

  drawReminderMarkers(reminders: Array<Reminder>) {
    this.map.clear();
    this.markers.clear();

    for (let rem of reminders) {
      let color = MapPage.getRandomColor();

      let markerOptions: GoogleMapsMarkerOptions = {
        'icon': color,
        'position': rem.latLng,
        'title': rem.name,
        'snippet': rem.description,
        'styles': {
            'maxWidth': '80%'
        },
        'markerClick': (marker: GoogleMapsMarker) => {
                          marker.showInfoWindow();
                        }
      };

      this.map.addMarker(markerOptions).then((marker: GoogleMapsMarker) => {
        this.markers.set(rem, marker);
        this.map.addCircle({
          'center': rem.latLng,
          'strokeColor' : color,
          'strokeWidth': 1,
          'radius': 100,
          'fillColor' : color
        });
      });
    }
  }

  centerOnReminder(rem: Reminder) {
    let marker = this.markers.get(rem);
    marker.getPosition().then((latLng) => {this.map.setCenter(latLng)});
    marker.showInfoWindow();
  }
}
