import { Component } from '@angular/core';

import { MapPage } from '../map/map';
import { ListPage } from '../list/list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  mapTabRoot: any = MapPage;
  listTabRoot: any = ListPage;

  constructor() {
  }
}
