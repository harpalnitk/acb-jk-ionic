import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CarRentalPage } from './car-rental.page';

describe('CarRentalPage', () => {
  let component: CarRentalPage;
  let fixture: ComponentFixture<CarRentalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarRentalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CarRentalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
