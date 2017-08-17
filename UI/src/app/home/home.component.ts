import {Component, Input, Output} from '@angular/core';
import { Headers, Http, Response } from '@angular/http';	
import {Observable} from "rxjs/Rx";
 import "rxjs/Rx";
import 'rxjs/add/operator/toPromise';
import {User} from "./user.model";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent {

	users = [];
	
	constructor(private http: Http) {}
	
	

	getDetails() {		
		
		 this.http.get('http://jsonplaceholder.typicode.com/users/')
        .flatMap((data) => data.json())		
        .subscribe((data) => {
          this.users.push(data);
        });

		 
	}
	
	extractData(res: Response){
		let body = res.json();
		return body || {};
	}
		

}


