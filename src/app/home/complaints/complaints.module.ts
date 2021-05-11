import { NgModule } from '@angular/core';
import { ComplaintsPageRoutingModule } from './complaints-routing.module';
import { ComplaintsPage } from './complaints.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewComplaintComponent } from './new-complaint/new-complaint.component';
import { ComplaintSummaryComponent } from './complaint-summary/complaint-summary.component';
import { ComplaintDetailComponent } from './complaint-detail/complaint-detail.component';
import { StoreModule } from '@ngrx/store';
import {complaintsReducer} from './store/complaints.reducer';

@NgModule({
  imports: [
    SharedModule,
    ComplaintsPageRoutingModule,
    StoreModule.forFeature('complaints', complaintsReducer)
  ],
  declarations: [
    ComplaintsPage,
    NewComplaintComponent,
    ComplaintSummaryComponent,
    ComplaintDetailComponent
  ],
  entryComponents: [
    NewComplaintComponent,
    ComplaintSummaryComponent,
    ComplaintDetailComponent
  ]
})
export class ComplaintsPageModule {}
