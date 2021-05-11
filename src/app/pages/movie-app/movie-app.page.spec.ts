import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MovieAppPage } from './movie-app.page';

describe('MovieAppPage', () => {
  let component: MovieAppPage;
  let fixture: ComponentFixture<MovieAppPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieAppPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
