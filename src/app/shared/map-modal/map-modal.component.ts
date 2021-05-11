import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapElementRef: ElementRef;
  //when we come to this modal from place-detail page we
  //want to show the marker at the center of the place 
  //of place detail page co-ordinates
  @Input() center = { lat: -34.397, lng: 150.644 };
  //if we come here from place detail page we don't want to select a place
  //we just want to view the map
  //hence using this variable
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title ='Pick a Location';
  clickListener: any;
  googleMaps: any;
  constructor(private modalCtrl: ModalController,
    private renderer: Renderer2) { }


  ngOnInit() { }

  ngAfterViewInit() {
    this.getGoogleMaps()
      .then(googleMaps => {
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement;
        const map = new this.googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 16
        });
        //just to add that transition effect of map loading
        this.googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });
        //only if we are in new-offer page
        //we can click on map and select a place
        if(this.selectable){
          this.clickListener = map.addListener('click', event => {
            const selectedCoords = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            this.modalCtrl.dismiss(selectedCoords);
          });
        } else {
          //if we come from place-detail page we add a marker on the page
          const marker = new this.googleMaps.Marker({
              position: this.center,
              map: map,
              title: 'Picked Location'
          });
          marker.setMap(map);
        }
      })
      .catch(
        err => {
          console.log(err)
        });
  }

  ngOnDestroy(): void {
    if(this.clickListener){
        this.googleMaps.event.removeListener(this.clickListener);
    }
  }

  onCancel() {
    this.modalCtrl.dismiss({ lat: -34.397, lng: 150.644 });
  }

  private getGoogleMaps(): Promise<any> {
    //window is a global variable available in javascript
    //that refers to browser window
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPIKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps)
        } else {
          reject('Google map SDK not available!')
        }
      }
    })
  }

}
