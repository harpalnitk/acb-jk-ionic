import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Profile } from 'src/app/profile/profile.model';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.scss'],
})
export class ViewContactComponent implements OnInit, OnChanges {
  @Input() profile: Profile;
  firstName: string;
  lastName: string;
  phones: string[];
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.firstName = this.profile?.firstName;
    this.lastName = this.profile?.lastName;
    this.phones = this.profile?.contact?.phones;
  }

  ngOnInit() {}

}
