import { ActionReducerMap, createFeatureSelector
,createSelector } from '@ngrx/store';
import * as fromUi from './shared/store/ui.reducer';
import * as fromAuth from './auth/store/auth.reducer';

export interface State {
  ui: fromUi.State;
  auth: fromAuth.State;
}

export const reducers: ActionReducerMap<State> = {
  ui: fromUi.uiReducer,
  auth: fromAuth.authReducer
};

//UI VARIABLES
export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getIsLoading =  createSelector(getUiState, fromUi.getIsLoading);

//AUTH VARIABLES
export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuth =  createSelector(getAuthState, fromAuth.getIsAuth);
export const getUserId =  createSelector(getAuthState, fromAuth.getUserId);

