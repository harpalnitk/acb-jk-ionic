import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'restaurant',
    loadChildren: () =>
      import('./pages/restaurant/restaurant.module').then(
        (m) => m.RestaurantPageModule
      ),
  },
  {
    path: 'car-rental',
    loadChildren: () =>
      import('./pages/car-rental/car-rental.module').then(
        (m) => m.CarRentalPageModule
      ),
  },
  {
    path: 'movie-app',
    loadChildren: () =>
      import('./pages/movie-app/movie-app.module').then(
        (m) => m.MovieAppPageModule
      ),
  },
  {
    path: 'pokemon',
    loadChildren: () =>
      import('./pages/pokemon/pokemon.module').then((m) => m.PokemonPageModule),
  },
  {
    path: 'flowers',
    loadChildren: () =>
      import('./pages/flowers/flowers.module').then((m) => m.FlowersPageModule),
  },
  // {
  //   path: 'project',
  //   loadChildren: () =>
  //     import('./pages/project/project.module').then((m) => m.ProjectPageModule),
  // },
  // {
  //   path: 'covid',
  //   loadChildren: () =>
  //     import('./pages/covid/covid.module').then((m) => m.CovidPageModule),
  // },
  // {
  //   path: 'covid',
  //   loadChildren: () =>
  //     import('./pages/covid/covid.module').then((m) => m.CovidPageModule),
  // },
  {
    path: 'acb-about',
    loadChildren: () =>
      import('./pages/acb-about/acb-about.module').then(
        (m) => m.AcbAboutPageModule
      ),
  },
  {
    path: 'acb-notification',
    loadChildren: () =>
      import('./pages/acb-notification/acb-notification.module').then(
        (m) => m.AcbNotificationPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
