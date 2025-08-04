import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {component: Home, path:''},
    {component: Dashboard, path:'dashboard', canActivate: [AuthGuard]}
];
