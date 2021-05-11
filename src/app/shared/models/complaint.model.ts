export interface Official {
    name: string;
    desig?: string;
    dept?: string
  }

export class Complaint{
     constructor(
      public title: string,
      public desc: string,
      public userId: string,
      public officials: Official[],
      public date: Date,
      public imageUrl?: string,
      public status?: string,
      public statusChangeDate?: Date,
      public id?: string,
     ){}
}