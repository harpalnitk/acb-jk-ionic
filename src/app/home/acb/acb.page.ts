import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acb',
  templateUrl: './acb.page.html',
  styleUrls: ['./acb.page.scss'],
})
export class AcbPage implements OnInit {
  contentArray = [
    {
      id: 'acb-about',
      title: 'About Us',
      subTitle: 'Who are we? What we do?',
      img: 'assets/svg/about.svg',
      color: 'success',
    },
    {
      id: 'contact',
      title: 'Contact Us',
      subTitle: 'Click to see contact information',
      img: 'assets/svg/contact.svg',
      color: 'warning',
    },
    {
      id: 'organization',
      title: 'Organization Chart',
      subTitle: 'Click to see the organization hierarchy',
      img: 'assets/svg/organization.svg',
      color: 'danger',
    },
    {
      id: 'news',
      title: 'In News',
      subTitle: 'Click to see us in the media',
      img: 'assets/svg/news.svg',
      color: 'tertiary',
    },
    {
      id: 'acb-notification',
      title: 'Notifications',
      subTitle: 'Important Circulars, Orders, Notifications etc.',
      img: 'assets/svg/notification.svg',
      color: 'success',
    },
    {
      id: 'citizen',
      title: "Citizen's Corner",
      subTitle: 'How to lodge grievances',
      img: 'assets/svg/population-system.svg',
      color: 'warning',
    },
    {
      id: 'rti',
      title: 'RTI',
      subTitle: 'RTI Information',
      img: 'assets/svg/information.svg',
      color: 'danger',
    },
    {
      id: 'links',
      title: 'Important Links',
      subTitle: 'Useful Resources on the web',
      img: 'assets/svg/world-wide-web.svg',
      color: 'tertiary',
    },
  ];
  constructor(private router: Router) {}

  ngOnInit() {}
}
