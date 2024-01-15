import {Component, OnInit} from '@angular/core';
import { LoadingService } from './services/loading.service';
import { MessageService } from './services/messages.service';
import { AuthStoreService } from './services/auth.store.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[
  /*   LoadingService, //con esto estamos asignando una instancia del loading service a este componente y todos sus componentes hijos
    MessageService */
  ]
})
export class AppComponent implements  OnInit {

    constructor(public auth:AuthStoreService) {

    }

    ngOnInit() {


    }

  logout() {
    this.auth.logout()
  }

}
