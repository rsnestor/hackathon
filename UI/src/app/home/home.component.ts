import {Component, Input, Output, OnInit} from '@angular/core';
import { Headers, Http, Response } from '@angular/http';	
import {Observable} from "rxjs/Rx";
 import "rxjs/Rx";
import 'rxjs/add/operator/toPromise';
//import {User} from "./user.model";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var ol: any;

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

	ol: any;

	users = [];
	
	markerLayer: any;
	
	constructor(private http: Http) {}
	
	ngOnInit(): void {
		
        var source = new ol.source.OSM() ;
        
        var osm = new ol.layer.Tile({
                source: source
            }) ;
        
        var olView = new ol.View({
            center: ol.proj.fromLonLat([-77, 38]),
            zoom: 2,
            minZoom: 1,
            maxZoom: 20,
            projection: 'EPSG:3857'
        }) ;
        
        //var markerLayer = new ol.layer.Vector
	this.markerLayer = new ol.layer.Vector({
            source: new ol.source.Vector({id:'asdad', features: [], projection: 'EPSG:4326' })
        });
        
        //var extent = ol.extent.boundingExtent() ;
        
        var map = new ol.Map({
            target: 'map' ,
            layers: [osm] ,
            //layers: [xyz] ,
            view: olView
        }) ;
	map.addLayer(this.markerLayer) ;
        //this.addMarker(81.1496, -37.3159) ;//add and remove marker
 

    }
    
        removeMarkers(){
                this.markerLayer.getSource().clear() ;
        }
    
    addMarker(lng, lat){

        var text = new ol.style.Text({
                textAlign: 'Center',
                textBaseline: 'Middle',
                font: 'Arial',
                text: '',
                fill: new ol.style.Fill({color: 'red'}),
                stroke: new ol.style.Stroke({color: 'green', width: 1}),
                offsetX: 0,
                offsetY: 0,
                rotation: 0
            }) ;

        //add marker as feature
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 1,
                src: './house-icon.png',
                scale: 0.1
            }),
            //text:text
        });
        var feature = new ol.Feature(
            new ol.geom.Point(ol.proj.fromLonLat([lng, lat]))
        ) ;
        feature.setStyle(iconStyle);

        this.markerLayer.getSource().addFeature(feature) ;
    }
	
	
	
	getDetails() {

                this.removeMarkers() ;
		
		 this.http.get('http://jsonplaceholder.typicode.com/users/')
		.flatMap((data) => data.json())		
		.subscribe((data) => {
			
		  this.users.push(data);
		});
		
		for(var i=0; i<this.users.length; i++){
			this.addMarker(parseFloat(this.users[i].address.geo.lng), parseFloat(this.users[i].address.geo.lat)) ;  
		  }
                this.users = [];
	}
	
	extractData(res: Response){
		let body = res.json();
		return body || {};
	}
	
	
		

}
