import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { AuthGuard } from './guards/auth.guard';
import { Login } from './pages/login/login';
import { Community } from './pages/community/community';
import { About } from './pages/about/about';

export const routes: Routes = [
  { component: Home, path: '' },
  { component: Dashboard, path: 'dashboard', canActivate: [AuthGuard] },
  { component: Login, path: 'login'},
  { component: Community, path: 'community', canActivate: [AuthGuard]},
  { component: About, path: 'aboutdearme'},
];
