import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AppConfigService } from '../../services/app-config.service';

@Component({
  selector: 'app-view-official',
  templateUrl: './view-official.component.html',
  styleUrls: ['./view-official.component.scss'],
})
export class ViewOfficialComponent implements OnInit, OnChanges {
  @Input() official;
  @Input() index;
  name;
  dept;
  desig;
  constructor(private appConfig: AppConfigService) {}

  ngOnInit() {
    console.log('Inside ngOnInit ViewOfficialComponent');

    // if(this.official){
    //     this.name = this.official.name;
    //     this.desig = this.getComplaintViewValues(this.official.desig, 'desig');
    //     this.dept = this.getComplaintViewValues(this.official.dept, 'dept');
    //   }
  }

  getComplaintViewValues(id: string, type: 'desig' | 'dept') {
    return this.appConfig.getComplaintsViewValues(id, type);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Inside ngOnChanges ViewOfficialComponent', this.official);
    if (this.official) {
      console.log(
        'in if Inside ngOnChanges ViewOfficialComponent',
        this.official
      );
      this.name = this.official.name;
      this.desig = this.getComplaintViewValues(this.official.desig, 'desig');
      this.dept = this.getComplaintViewValues(this.official.dept, 'dept');
    }
  }
}
