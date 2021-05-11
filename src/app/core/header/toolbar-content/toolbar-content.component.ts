import { AuthService, User } from './../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import * as fromRoot from '../../../app.reducer';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-toolbar-content',
  templateUrl: './toolbar-content.component.html',
  styleUrls: ['./toolbar-content.component.scss'],
})
export class ToolbarContentComponent implements OnInit {
  user$: Observable<User | null>;
  isAuth$: Observable<boolean>;
  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.user$ = this.authService.user$;
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  clickedSearch() {}
}
