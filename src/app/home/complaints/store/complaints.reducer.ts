import * as ComplaintsActions from './complaints.actions';
import * as fromRoot from '../../../app.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Complaint } from '../../../shared/models/complaint.model';

export interface ComplaintsState {
complaint: Complaint;
complaints: Complaint[];
prev: boolean,
next: boolean
}
//Our App State does not know about training state
//but training state knows about app state
//ngrx will behind the scene merge both states
//whenever this module is loaded lazily
export interface State extends fromRoot.State{
complaints: ComplaintsState
}

const initialState: ComplaintsState = {
  complaint: null,
  complaints: [],
  prev: false,
  next: true
}

export function complaintsReducer(state= initialState, action: ComplaintsActions.ComplaintsActions){
switch (action.type){
  case ComplaintsActions.ComplaintsActionTypes.SET_COMPLAINT:
  return {
    ...state, complaint: action.payload
  };
  case ComplaintsActions.ComplaintsActionTypes.SET_COMPLAINTS:
  return {
    ...state, complaints: action.payload
  }
  case ComplaintsActions.ComplaintsActionTypes.SET_SHOW_PREV:
    return {
      ...state, prev: action.payload
    }
    case ComplaintsActions.ComplaintsActionTypes.SET_SHOW_NEXT:
      return {
        ...state, next: action.payload
      }
  default:
    return state;

}
}


export const getComplaintsState = createFeatureSelector<ComplaintsState>('complaints');
export const getComplaint = createSelector(getComplaintsState, (state: ComplaintsState) => state.complaint);
export const getComplaints = createSelector(getComplaintsState, (state: ComplaintsState) => state.complaints);

export const getPrev = createSelector(getComplaintsState, (state: ComplaintsState) => state.prev);
export const getNext = createSelector(getComplaintsState, (state: ComplaintsState) => state.next);
