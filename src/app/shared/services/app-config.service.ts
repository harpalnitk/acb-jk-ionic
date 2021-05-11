import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface StateData{
  id : string;
  type: string;
  capital : string;
  code: string;
  name : string;
  districts : MapData[];
}

export interface MapData {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private appConfig;
  private statesData;
  private complaintsData;

  constructor(private http: HttpClient) {
   // this.loadStatesData(); // will be loaded in complaints page and profile page
   // this.loadComplaintsData();// will be loaded in complaints page
   }
// For loading config values from assets/data/appConfig.json file
  loadAppConfig() {
    if(!this.appConfig){
   this.http.get('/assets/data/appConfig.json')
      .toPromise()
      .then(data => {
        this.appConfig = data;
      });
    }
  }

  loadStatesData() {
    if(!this.statesData){
      console.log('Loading States Data');
      this.http.get('/assets/data/statesData.json')
      .toPromise()
      .then(data => {
        console.log('States Data', data);
        this.statesData = data;
      });
    }

  }

  loadComplaintsData() {
    if(!this.complaintsData){
      console.log('Loading Complaints Data');
      return this.http.get('/assets/data/complaintsData.json')
      .toPromise()
      .then(data => {
        console.log('Complaints Data', data);
        this.complaintsData = data;
      });
    }

  }

  getComplaintsData(type: 'dept'|'desig'): MapData[]{
    console.log(`getComplaintsData type: ${type}`);
    const departments: MapData[] = this.complaintsData[type];
    let dataArray: MapData[] = [];
    for(const key in departments){
      if(departments.hasOwnProperty(key)){
      let data = {id: departments[key].id, name: departments[key].name};
      dataArray.push(data);
    }
    }
    return dataArray;
}
getComplaintsViewValues(id: string, type: 'desig' | 'dept'){
  let data: MapData = this.complaintsData[type].find((data: MapData) => {
    return data.id === id});
  return data.name;
}

  getStates(): MapData[]{
      const states: StateData[] = this.statesData['states'];
      let minStateData: MapData[] = [];
      for(const key in states){
        if(states.hasOwnProperty(key)){
        let minState = {id: states[key].id, name: states[key].name};
        minStateData.push(minState);
      }
      }
     // console.log('minStateData', minStateData);
      return minStateData;
  }

  // getStateViewValue(stateId: string){
  //   let state: StateData = this.statesData['states'].find((state: StateData) => state.id === stateId);
  //   return state[0].name;
  // }

  getDistricts(stateId: string): MapData[]{
    let state: StateData = this.statesData['states'].filter((state: StateData) => state.id === stateId);
    return state[0].districts;
  }

  // getDistrictViewValue(stateId: string, districtId: string){
  //   let state: StateData = this.statesData['states'].find((state: StateData) => state.id === stateId);
  //   return state[0].districts.find((district: RegionData)=> district.id === districtId)[0].name;
  // }

  getTehsils(stateId: string, districtId: string): MapData[]{
    try{
      let state: StateData = this.statesData['states'].filter((state: StateData) => state.id === stateId);
      let districts =  state[0].districts;
      districts = districts.filter((district: MapData)=> district.id === districtId);
      if(districts[0].tehsils){
        return districts[0].tehsils;
      }else {
        return undefined;
      }
    }catch(err){
        console.log(err)
        return undefined;
    }
  }

  getViewValues(stateId: string, districtId: string, tehsilId: string){
    //console.log(`getViewValues stateId: ${stateId} districtId: ${districtId} tehsilId: ${tehsilId}`)
    //console.log(`state: ${stateId} district: ${districtId} tehsil: ${tehsilId}`);
    let state: StateData = this.statesData['states'].find((state: StateData) => {
      return state.id === stateId});
    let district: any = state.districts.find((district: any)=> district.id === districtId);
    let tehsil;
    if(district.tehsils){
      tehsil = district.tehsils.find((tehsil: any)=> tehsil.id === tehsilId);
    }
    let tehsilName = tehsil ? tehsil.name : tehsilId;
    return {state: state.name, district: district.name, tehsil: tehsilName}
  }

  getConfig(key: string) {
    return this.appConfig[key];
  }

  getImageURL(id: string): string {
    return this.getConfig('defaultUrl') + "/api/user/"+id+"/avatar?"

  }
}
