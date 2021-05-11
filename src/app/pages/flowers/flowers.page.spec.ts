import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlowersPage } from './flowers.page';

describe('FlowersPage', () => {
  let component: FlowersPage;
  let fixture: ComponentFixture<FlowersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FlowersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
