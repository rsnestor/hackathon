import {Component, Input, Output, OnInit} from '@angular/core';
import { Headers, Http, Response } from '@angular/http';	
import {Observable} from "rxjs/Rx";
 import "rxjs/Rx";
import 'rxjs/add/operator/toPromise';
//import {User} from "./user.model";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var ol: any;
declare var jQuery: any;

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

	ol: any;
        jQuery: any;

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
                
                this.initPopupWindow(map) ;
        }
        
        initPopupWindow(map){
                var popHtml = 
                        '<div id="popup" class="ol-popup">' +
                        '<a href="#" id="popup-closer" class="ol-popup-closer"></a>' +
                        //'<div id="popup-content" style="width:300px;"></div>' +
                        '<div id="popup-content"></div>' +
                        '</div>' ;
                var self = this ;
                jQuery('#ol_overlay_contain').append(popHtml).each(function(){
                        var container = document.getElementById('popup');
                        var content = document.getElementById('popup-content');
                        var closer = document.getElementById('popup-closer');

                        var overlay = new ol.Overlay({
                                element: container,
                                autoPan: true,
                                autoPanAnimation: {
                                        duration: 250
                                }
                        });

                        closer.onclick = function() {
                                overlay.setPosition(undefined);
                                closer.blur();
                                return false;
                        };

                        map.on('singleclick', function(evt){
                                map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
                                        if(feature.getGeometry().getType() == 'Point'){
                                                var coordinate = evt.coordinate;
                                                var id = feature.getId() ;
                                                var name = self.users[id].name;
                                                var companyName = self.users[id].company.name;
                                                var url = self.users[id].website;
                                                content.innerHTML = 
                                                '<div>' +
                                                '<table class="popup-table">' +
                                                '<tr><td><span>name: '+name+'</span></td></tr>' +
                                                '<tr><td><span>company: '+companyName+'</span></td></tr>' +
                                                '<tr><td><span>website: <a href="http://'+url+'"> '+url+'</a></span></td></tr>' +            
                                                '</table>' +
                                                '</div>' ;
                                                map.addOverlay(overlay) ;
                                                overlay.setPosition(coordinate);
                                        }
                                }) ;
                        }) ;
                }) ;
        }

        removeMarkers(){
                this.markerLayer.getSource().clear() ;
        }
    
        addMarker(lng, lat, id){
                var markerId = typeof(id)=='undefined'? 'asdfads':id

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
                feature.setId(markerId) ;

                this.markerLayer.getSource().addFeature(feature) ;
        }
	
	getDetails() {

                this.removeMarkers() ;
		
		 this.http.get('https://jsonplaceholder.typicode.com/users/')
                 //this.http.get('http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1fy18vhuia3_6v82r&address=9416+Mayflower+Ct&citystatezip=Laurel%2C+MD')
		.flatMap((data) => data.json())		
		.subscribe((data) => {
			
		  this.users.push(data);
		});
		
		for(var i=0; i<this.users.length; i++){
                        //this.users[i].url = "https://www.google.com";
			this.addMarker(parseFloat(this.users[i].address.geo.lng), parseFloat(this.users[i].address.geo.lat), i) ;  
		  }
                this.users = [];
	}
}
