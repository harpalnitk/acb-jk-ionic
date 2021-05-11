import * as UIActions from './ui.actions';

export interface State {
  isLoading: boolean;
}

const initialState: State = {
  isLoading: false,
}

export function uiReducer(state= initialState, action: UIActions.UIActions){
switch (action.type){
  case UIActions.UIActionTypes.START_LOADING:
  return {
    ...state, isLoading: true, 
  };
  case UIActions.UIActionTypes.STOP_LOADING:
  return {
    ...state, isLoading: false
  }
  default:
    return state;

}
}

 export const getIsLoading = (state: State) => state.isLoading;

