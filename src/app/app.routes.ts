import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then((m) => m.Home)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login').then((m) => m.Login)
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/auth/signup/signup').then((m) => m.Signup)
  },
];
