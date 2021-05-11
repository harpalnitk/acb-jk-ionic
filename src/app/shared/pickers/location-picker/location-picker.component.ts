import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation, Coordinates } from './location.model';
import { of } from 'rxjs';

import {Plugins, Capacitor} from '@capacitor/core';


@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  
// To clear the image and static location pictures when
// we visit the form page of new-place entry again
@Input() showPreview = false;
  selectedLocationImage: string;
  modal;
  isLoading = false;

  constructor(private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController) { }

  ngOnInit() {}

 onPickLocation(){
   this.presentActionSheet();
}

async presentActionSheet() {
  const actionSheet = await this.actionSheetCtrl.create({
    header: 'Please Choose',
    buttons: [{
      text: 'Auto-Locate',
      handler: async () => {
        console.log('Auto-Locate clicked');
        await this.locateUser();
      }
    },
    {
      text: 'Pick on Map',
      handler: async () => {
        console.log('Pick on Map');
        await this.presentModal();
      }
    },
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    },
    ]
  });
  await actionSheet.present();
}

private async locateUser(){
if(!Capacitor.isPluginAvailable('Geolocation')){
  this.presentAlert();
return;
}
try{
  this.isLoading = true;
  const geoPos: any = await Plugins.Geolocation.getCurrentPosition();
  console.log('Current Location', geoPos);
  const coordinates: Coordinates = {lat: geoPos.coords.latitude, lng: geoPos.coords.longitude}
  this.createPlace(coordinates.lat, coordinates.lng);
  this.isLoading = false;;
}
catch(err){
  this.isLoading = false;
  this.presentAlert();
}





}



async presentAlert() {
  const alert = await this.alertCtrl.create({
    header: 'Error',
    subHeader: 'Could not fetch locaion!',
    message: 'Place use the map to pick a location!',
    buttons: [{
      text: 'Okay',
      // handler: () => {
      //  this.router.navigate(['/places/tabs/discover']);
      // }
    }]
  });

  await alert.present();
}


  async presentModal() {
     this.modal = await this.modalCtrl.create({
      component: MapModalComponent,
      // componentProps: {
      //   'firstName': 'Douglas',
      //   'lastName': 'Adams',
      //   'middleInitial': 'N'
      // }
    });
     await this.modal.present();
     //SINCE MAP API IS NOT ENABLED
     //SENDING HARDCODED COORDINATES FROM CANCEL BUTTON
     //CHANGE IT LATER WHEN GOOGLE APIS WORK
     const { data } = await this.modal.onWillDismiss();
     console.log(data);
     if(!data){
       return;
     }
     console.log(`Lat: ${data.lat}, Lng: ${data.lng}`);
     const coordinates: Coordinates = {
       lat: data.lat,
       lng: data.lng
     }
     this.createPlace(coordinates.lat, coordinates.lng);
     return;
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat: lat,
      lng: lng,
      address:null,
      staticMapImageUrl:null
    };
    this.isLoading = true;
    this.getAddress(lat, lng).pipe(
      switchMap(address => {
       console.log(`address: ${address}`);
       pickedLocation.address = address;
//ADDRESS WILL BE NULL AS GOOGLE API IS NOT WORKING
//THUS SETTING HARD CODED ADDRESS
//COMMENT BELOW LINE LATER
pickedLocation.address = '282/A, Narwal Pain Satwari, Jammu-18003';
       //switchMap expects an observable as return value. hence of used
       return of(this.getMapImage(pickedLocation.lat,pickedLocation.lng,14));
     })
      
    ).subscribe((staticMapImageUrl: any) => {
      console.log('staticMapImageUrl',staticMapImageUrl);
      pickedLocation.staticMapImageUrl = staticMapImageUrl;
      this.selectedLocationImage = staticMapImageUrl;
      this.isLoading = false;
      this.locationPick.emit(pickedLocation);
    });
  }

  private getAddress(lat: number, lng: number){
    const GOOGLE_MAP_GEOCODING_API = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPIKey}`
   return this.http.get<any>(GOOGLE_MAP_GEOCODING_API).pipe(
     map((geoData: any) => {
       console.log('geoData', geoData);
       if(!geoData || !geoData.results || geoData.results.length === 0){
         return null;
       }
       return geoData.results[0].formatted_address;
     })
   ); 
  }

  private getMapImage(lat: number, lng: number, zoom: number){
const GOOGLE_MAP_STATIC_API = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
&markers=color:red%7Clabel:Place${lat},${lng}&key=${environment.googleMapsAPIKey}`;
//it will directly give an image and not json data
console.log('GOOGLE_MAP_STATIC_API:', GOOGLE_MAP_STATIC_API);

return GOOGLE_MAP_STATIC_API;
  }
}
