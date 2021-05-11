import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { Complaint } from '../../shared/models/complaint.model';
import { ComplaintDetailComponent } from './complaint-detail/complaint-detail.component';
import { ComplaintsService } from './complaints.service';
import { NewComplaintComponent } from './new-complaint/new-complaint.component';

import * as fromComplaints from './store/complaints.reducer';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.page.html',
  styleUrls: ['./complaints.page.scss'],
})
export class ComplaintsPage implements OnInit, OnDestroy {
  complaints$: Observable<Complaint[]>;
  relevantComplaints$: Observable<Complaint[]>;
  isLoading$: Observable<boolean>;
  subs: Subscription[] = [];
  complaint: Complaint;
  status$ = new Subject<string>();
  statusObservable$: Observable<string>;

  next$: Observable<boolean>;
  prev$: Observable<boolean>;


  constructor(
    private modalCtrl: ModalController,
    private complaintsService: ComplaintsService,
    private appConfigService: AppConfigService,
    private store: Store<fromComplaints.State>
  ) {}

  ngOnInit() {
    this.complaints$ = this.store.select(fromComplaints.getComplaints);

    this.next$ = this.store.select(fromComplaints.getNext);
    this.prev$ = this.store.select(fromComplaints.getPrev);

    this.statusObservable$ = this.status$.asObservable().pipe(startWith('all'));

    this.relevantComplaints$ = combineLatest([
      this.complaints$,
      this.statusObservable$,
    ]).pipe(
      map(([complaints, status]) =>
        complaints.filter((complaint) => {
          if (status === 'all') {
            return true;
          } else {
            return complaint.status === status;
          }
        })
      )
    );

    this.appConfigService.loadComplaintsData();
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
  }

  ionViewWillEnter() {
    this.complaintsService.loadStartPage();
  }

  async onNewComplaint() {
    console.log('onNewComplaint');
    const modal = await this.modalCtrl.create({
      component: NewComplaintComponent,
      id: 'new-complaint',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      const complaintData = data.complaintData;
      return this.complaintsService.addComplaint(
        complaintData.title,
        complaintData.desc,
        complaintData.officials,
        data.imageURL
      );
    }
  }

  onFilterUpdate(event: CustomEvent<any>) {
    if (event.detail.value === 'all') {
      this.status$.next('all');
    } else if (event.detail.value === 'open') {
      this.status$.next('open');
    } else if (event.detail.value === 'closed') {
      this.status$.next('closed');
    }
  }
  //View Complaint DEtails
  async onViewComplaintDetail(complaint: Complaint) {
    const modal = await this.modalCtrl.create({
      component: ComplaintDetailComponent,
      id: 'complaint-detail',
      componentProps: {
        complaint: { ...complaint },
      },
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    console.log(`Data: ${data} Role: ${role}`);
    return;
  }
  next() {
    this.complaintsService.nextPage();
  }

  prev() {
    this.complaintsService.prevPage();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  onImgError($event: any) {
    //console.log('Error occured in loading image', $event);
    $event.target.src = '/assets/images/slow_connection.png';
  }
}
