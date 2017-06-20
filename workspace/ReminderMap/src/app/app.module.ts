import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { TabsPage } from '../pages/tabs/tabs';
import { MapPage } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
import { ReminderProvider } from '../providers/reminder';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    TabsPage,
    MapPage,
    ListPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    TabsPage,
    MapPage,
    ListPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
              {provide: ReminderProvider, useClass: ReminderProvider}]
})
export class AppModule {}
