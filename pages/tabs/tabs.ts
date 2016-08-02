import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { MapPage } from '../map/map';
import { TestListPage } from '../test-list/test-list';

@Component({
  	templateUrl: 'build/pages/tabs/tabs.html',
})
export class TabsPage {

	private tab1Root: any;
	private tab2Root: any;
	private tab3Root: any;

  	constructor() {
  		this.tab1Root = MapPage;
  		this.tab2Root = HomePage;
  		this.tab3Root = TestListPage;
  	}
}
