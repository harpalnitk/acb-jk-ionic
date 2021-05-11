import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  option = {
    slidesPerView: 1.4,
    spaceBetween: 0,
    centeredSlides: true,
  };
  constructor() {}

  ngOnInit() {}
}
