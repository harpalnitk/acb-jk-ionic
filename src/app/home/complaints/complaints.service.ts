import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { Complaint, Official } from 'src/app/shared/models/complaint.model';

import * as fromComplaints from '../complaints/store/complaints.reducer';
import * as ComplaintActions from '../complaints/store/complaints.actions';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import { UIService } from '../../shared/services/ui.service';
import * as UIActions from '../../shared/store/ui.actions';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { convertSnapsPagination } from 'src/app/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class ComplaintsService {
  docLimit = 3;

  complaintsCollection: AngularFirestoreCollection<Complaint>;
  complaintDoc: AngularFirestoreDocument<Complaint>;
  //currentUserId$: Observable<string>;
  complaints$: Observable<any>;
  currentUserId;
  changePage$ = new Subject<string>();
  changePageAction;

  //For Pagination
  //Save first document in snapshot of items received
  firstInResponse: any = [];

  //Save last document in snapshot of items received
  lastInResponse: any = [];

  //Keep the array of first document of previous pages
  prev_strt_at: any = [];

  //Maintain the count of clicks on Next Prev button
  pagination_clicked_count = 0;

  //Disable next and prev buttons
  //disable_next: boolean = false;
  //disable_prev: boolean = false;

  private subs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private store: Store<fromComplaints.State>,
    private uiService: UIService
  ) {
    this.complaintsCollection = this.db.collection('complaints');
    this.changePage$
      .asObservable()
      .pipe(tap(() => {
        console.log('changePage$ pipe starting loading')
        this.store.dispatch(new UIActions.StartLoading())
      }));
    this.setUpComplaintsCollectionQuery();
    this.loadComplaintsSubscription();
  }
  //  this.db.collection('complaints', ref =>
  //  ref.where('userId', '==', this.currentUserId).orderBy('date', 'desc').limit(10)
  //   .valueChanges({ idField: 'id' })

  setUpComplaintsCollectionQuery() {
    this.subs.push(
      this.store.select(fromRoot.getUserId).subscribe((userId) => {
        this.currentUserId = userId;
        //Setting up complaints collectio observable
        this.complaints$ = combineLatest([this.changePage$]).pipe(
          switchMap(([changePage]) => {
            //To be used in subscribe when results come
            this.changePageAction = changePage;
            console.log(`Inside combineLatest changePage = ${changePage}`);
            return this.db
              .collection('complaints', (ref) => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (changePage === 'load') {
                  console.log(`Inside load query`);
                  query = query
                    .where('userId', '==', this.currentUserId)
                    .orderBy('date', 'desc')
                    .limit(this.docLimit);
                } else if (changePage === 'prev') {
                  console.log(`Inside prev query this.firstInResponse = ${JSON.stringify(this.firstInResponse.data().title)}`);
                   console.log(`Inside prev query this.get_prev_startAt() = ${JSON.stringify(this.get_prev_startAt().data().title)}`);
                  query = query
                    .where('userId', '==', this.currentUserId)
                    .orderBy('date', 'desc')
                    .startAt(this.get_prev_startAt())
                    .endBefore(this.firstInResponse)
                    .limit(this.docLimit);
                } else if (changePage === 'next') {
                  console.log(`Inside next query this.lastInResponse = ${JSON.stringify(this.lastInResponse.data().title)}`);
                  query = query
                    .where('userId', '==', this.currentUserId)
                    .orderBy('date', 'desc')
                    .limit(this.docLimit)
                    .startAfter(this.lastInResponse);
                }
                return query;
              })
              .snapshotChanges();
          }) //end of switchMap
        ); //end of combineLatest
      }) //end of subscribe
    ); //end of subs.push
  }

  loadComplaintsSubscription() {
    //No need to unsubscribe as angular will replace
    //new subscription with old one automatically

    //  this.complaintsCollection = this.db.collection('complaints', ref =>
    //  ref.where('userId', '==', this.currentUserId).orderBy('date', 'desc').limit(10).startAt(10)
    //  );
    this.subs.push(
      this.complaints$
        .pipe(map((snaps) => convertSnapsPagination<any>(snaps)),
        finalize(()=>{
          console.log('calling stop loading');
          this.store.dispatch(new UIActions.StopLoading());
        }))
        .subscribe(
          (res: any) => {
            console.log('Complaints with value changes', res.model);
           
            if (res) {
              if(res.model.length < this.docLimit){
                this.store.dispatch(new ComplaintActions.SetShowNext(false));
              }
              this.store.dispatch(
                new ComplaintActions.SetComplaints(res.model)
              );
              this.firstInResponse = res.firstInResponse;
              this.lastInResponse = res.lastInResponse;
              //Initialize values
              //this.disable_next = false;
              //this.disable_prev = false;

              //Push first item to use for Previous action
              if (this.changePageAction === 'load') {
                //Initialize values
                this.prev_strt_at = [];
                this.pagination_clicked_count = 0;
                this.store.dispatch(
                  new ComplaintActions.SetShowPrev(false)
                );
                this.store.dispatch(
                  new ComplaintActions.SetShowNext(true)
                );
                this.push_prev_startAt(this.firstInResponse);
              } else if (this.changePageAction === 'next') {
                this.push_prev_startAt(this.firstInResponse);
                this.pagination_clicked_count++;
                this.store.dispatch(
                  new ComplaintActions.SetShowPrev(true)
                );
              } else {
                //Pop not required value in array
                this.pop_prev_startAt(this.firstInResponse);
                this.pagination_clicked_count--;
                if(this.pagination_clicked_count == 0){
                  this.store.dispatch(
                    new ComplaintActions.SetShowPrev(false)
                  );
                }
              }
            } else {
              this.store.dispatch(new ComplaintActions.SetComplaints([]));
            }
          },
          (err) => {
            console.log('Error', err);
            this.uiService.presentToast('Error in fetching complaints!');
          }
        )
    );
  }

  //Add document
  push_prev_startAt(prev_first_doc) {
    this.prev_strt_at.push(prev_first_doc);
    //console.log('this.prev_strt_at', JSON.stringify(this.prev_strt_at));
    console.log('this.prev_strt_at length', this.prev_strt_at.length);
  }

  //Remove not required document
  pop_prev_startAt(prev_first_doc) {
    this.prev_strt_at.forEach((element) => {
      if (prev_first_doc.data().id == element.data().id) {
        element = null;
      }
    });
  }

  //Return the Doc rem where previous page will startAt
  get_prev_startAt() {
    console.log('this.pagination_clicked_count',this.pagination_clicked_count);
    console.log('this.prev_strt_at.length',this.prev_strt_at.length);
    console.log('this.prev_strt_at',this.prev_strt_at);
    if (this.prev_strt_at.length > this.pagination_clicked_count + 1)
      this.prev_strt_at.splice(
        this.prev_strt_at.length - 2,
        this.prev_strt_at.length - 1
      );
      console.log('this.prev_strt_at',this.prev_strt_at);
    return this.prev_strt_at[this.pagination_clicked_count - 1];
  }

  loadStartPage() {
    this.changePage$.next('load');
  }

  nextPage() {
    console.log('Next page in service');
    this.changePage$.next('next');
  }

  prevPage() {
    console.log('Previous page in service');
    this.changePage$.next('prev');
  }

  async addComplaint(
    title: string,
    desc: string,
    officials: Official[],
    imageUrl?: string
  ) {
    console.log('In add', this.currentUserId);
    if (this.currentUserId) {
      this.uiService.presentLoading('Submitting Complaint...');
      const newComplaint = new Complaint(
        title,
        desc,
        this.currentUserId,
        officials,
        new Date(),
        imageUrl || null,
        'open',
        new Date()
      );
      delete newComplaint.id;
      console.log('In add complaint', JSON.stringify(newComplaint));
      return this.complaintsCollection
        .add({ ...newComplaint })
        .then((res) => {
          this.uiService.dismissLoading();
          this.uiService.presentToast('Complaint submitted successfully!');
        })
        .catch((err) => {
          this.uiService.dismissLoading();
          this.uiService.presentToast(
            'Error in submitting complaint. Please try again!'
          );
        });
    } else {
      this.uiService.presentToast('Please Login to submit complaint!');
      return;
    }
  }

  getComplaint(id: string) {
    return this.db.doc<Complaint>(`complaints/${id}`);
  }
  getComplaintData(id) {
    return this.getComplaint(id).valueChanges();
  }

  delete(id: string) {
    return this.getComplaint(id).delete();
  }
  update(id: string, data: any) {
    return this.getComplaint(id).update(data);
  }

  cancelSubscriptions() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
