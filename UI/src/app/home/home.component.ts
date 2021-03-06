import {Component, Input, Output, OnInit, NgZone} from '@angular/core';
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

  //var client = new XMLHttpRequest()

  markerLayer: any;

  constructor(private http: Http, private zone:NgZone) {
    window['angularComponentRef'] = {component: this, zone: zone};
  }

  ngOnInit(): void {

    var source = new ol.source.OSM() ;

    var osm = new ol.layer.Tile({
      source: source
    }) ;

    var olView = new ol.View({
      center: ol.proj.fromLonLat([-77.482995, 39.053158]),
      zoom: 14,
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
      //'<div id="popup-content" style="width:360px;"></div>' +
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
            var street = self.users[id].street;
            var city = self.users[id].city;
            var zipcode = self.users[id].zip;

            var name;
            var company;
            var website;
            var results;
            var data;
            var error;

            //self.http.get('http://jsonplaceholder.typicode.com/users/')
            self.http.get('https://gfaxha1qt8.execute-api.us-east-1.amazonaws.com/dev/propertyInfo?address='+street+'&&zipCode='+zipcode)
            //.flatMap((data) => data.json())
            //.map(res => res.json())
              .map(res => res.json())
              .subscribe((data) => {
                //var data1 =  JSON.stringify(data);
                var street = (data as any)['SearchResults:searchresults'].response.results.result.address.street;
                var zipcode = (data as any)['SearchResults:searchresults'].response.results.result.address.zipcode;
                if(street!==undefined && zipcode!==undefined){
                  var links = (data as any)['SearchResults:searchresults'].response.results.result.links;
                  var linksKey = Object.keys(links);
                  var linksLength = linksKey.length;
                  content.innerHTML =
                    '<div>' +
                    '<table class="popup-table">' +
                    '<tr><td><span><bold>Street</bold>: '+street+'</span></td></tr>' +
                    '<tr><td><span><bold>Zipcode</bold>: '+zipcode+'</span></td></tr>';

                  for(var j=0; j<linksLength; j++){
                    var key = linksKey[j];
                    var website;
                    if(links[key]!==undefined){
                      website = links[key];
                      if(website!==undefined){
                        content.innerHTML += '<tr align="left"><td><span><a href="'+website+'"> '+key+'</a></span></td></tr><br>';
                      }
                    }

                  }

                  content.innerHTML += '<tr><td><button id="undercontract" onclick="sendMsg(\'' + self.users[id].long + ":" + self.users[id].lat + ":" + self.users[id].id + '\')">Under Contract</button></td></tr>';
                  content.innerHTML += '</table>' +
                    '</div>' ;

                  map.addOverlay(overlay) ;
                  overlay.setPosition(coordinate);
                }


              });
          }
        }) ;
      }) ;

    }) ;
  }

  removeMarkers(){
    this.markerLayer.getSource().clear() ;
  }

  addMarker(lng, lat, id, image){

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
    var iconStyle = new ol.style.Style
    ({
      image: new ol.style.Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        opacity: 1,
        src: image,
        scale: 0.2

      }),
      //text:text,

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
    var i=0;

    this.http.get('https://wmusxd4z8i.execute-api.us-east-1.amazonaws.com/dev/addr')
      .flatMap((data) => data.json())
      .subscribe((data) => {
        //this.users.push(data);
        this.users[i] = data;

        var longAddr = (data as any).long;
        var latAddr = (data as any).lat;

        if(longAddr !== undefined && latAddr !== undefined){
          this.addMarker(parseFloat(longAddr), parseFloat(latAddr), i, "./house-icon.png") ;
        }
        i = i+1;
      });

    //this.users = [];
  }

  removeMarker(long, lat){
    var feature = new ol.Feature(
      new ol.geom.Point(ol.proj.fromLonLat([long, lat]))
    ) ;
    this.markerLayer.removeFeatures([feature], false);
  }

  calledFromOutside(long, lat, id) {
    window['angularComponentRef'].zone.run(() => {
      //this.removeMarker(long, lat);
      this.addMarker(long, lat, id, "./yellowicon.png");
    });
  }
}
