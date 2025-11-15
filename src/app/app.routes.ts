import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Login } from './pages/login/login';
import { PrincipalDashboard } from './pages/principal-dashboard/principal-dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'login', component: Login },
  {
    path: 'principal-dashboard',
    component: PrincipalDashboard,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
