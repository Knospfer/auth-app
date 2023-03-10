import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  canActivateLoggedIn,
  canActivateNotLoggedIn,
} from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home', //mettp la home come route perchè ho la guardia che mi porta al login se non ho il token nel local storage
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [() => canActivateNotLoggedIn()], //in questo modo importo la guarda CanActivate che si attiva prima di entrare in una pagina (ci sono diversi tipi di guardia ma questa + la più usata)
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [() => canActivateLoggedIn()], //in questo modo importo la guarda CanActivate che si attiva prima di entrare in una pagina (ci sono diversi tipi di guardia ma questa + la più usata)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
