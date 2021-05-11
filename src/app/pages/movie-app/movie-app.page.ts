import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-movie-app',
  templateUrl: './movie-app.page.html',
  styleUrls: ['./movie-app.page.scss'],
})
export class MovieAppPage implements OnInit {
  options = {
    centeredSlides: true,
    loop: true,
    spaceBetween: -100,
  };
  constructor() {}

  ngOnInit() {}
}
