import { DocPickerComponent } from './pickers/doc-picker/doc-picker.component';
import { NgModule } from '@angular/core';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { RegionPickerComponent } from './pickers/region-picker/region-picker.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ArrayToStringWithDelimiter } from './pipes/array-to-string-with-delimiter';
import { ViewAddressComponent } from './components/view-address/view-address.component';
import { ViewContactComponent } from './components/view-contact/view-contact.component';
import { ViewOfficialComponent } from './components/view-official/view-official.component';
import { FromNowPipe } from './pipes/from-now.pipe';
import { HttpClientModule } from '@angular/common/http';

// For loading config values from assets/data/appConfig.json file

@NgModule({
  declarations: [
    LocationPickerComponent,
    MapModalComponent,
    ImagePickerComponent,
    RegionPickerComponent,
    ArrayToStringWithDelimiter,
    ViewAddressComponent,
    ViewContactComponent,
    ViewOfficialComponent,
    FromNowPipe,
    DocPickerComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  exports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    LocationPickerComponent,
    MapModalComponent,
    ImagePickerComponent,
    RegionPickerComponent,
    ArrayToStringWithDelimiter,
    ViewAddressComponent,
    ViewContactComponent,
    ViewOfficialComponent,
    FromNowPipe,
    DocPickerComponent,
  ],
  entryComponents: [MapModalComponent],
})
export class SharedModule {
  constructor() {}
}
