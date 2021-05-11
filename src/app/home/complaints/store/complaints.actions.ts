import { Action } from "@ngrx/store";
import { Complaint } from "../../../shared/models/complaint.model";


export enum ComplaintsActionTypes {
  SET_COMPLAINT = '[Complaints] Set Complaint',
  SET_COMPLAINTS = '[Complaints] Set Complaints',
  SET_SHOW_PREV = '[Complaints] Set Show Prev',
  SET_SHOW_NEXT = '[Complaints] Set Show Next'
}


export class SetComplaint implements Action {
  readonly type = ComplaintsActionTypes.SET_COMPLAINT;
  constructor(public payload: Complaint){}
}

export class SetComplaints implements Action {
  readonly type = ComplaintsActionTypes.SET_COMPLAINTS;
  constructor(public payload: Complaint[]){}
}
export class SetShowPrev implements Action {
  readonly type = ComplaintsActionTypes.SET_SHOW_PREV;
  constructor(public payload: boolean){}
}
export class SetShowNext implements Action {
  readonly type = ComplaintsActionTypes.SET_SHOW_NEXT;
  constructor(public payload: boolean){}
}


export type ComplaintsActions =
SetComplaint |
SetComplaints |
SetShowPrev |
SetShowNext;
