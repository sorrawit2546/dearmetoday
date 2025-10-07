import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { AuthGuard } from './guards/auth.guard';
import { Login } from './pages/login/login';
import { Community } from './pages/community/community';
import { About } from './pages/about/about';
import { PrivacyComponent } from './pages/privacy/privacy';
import { TermsComponent } from './pages/terms/terms';
import { CollectStampComponent } from './components/collect-stamp-component/collect-stamp-component';

export const routes: Routes = [
  { component: Home, path: '' },
  { component: Dashboard, path: 'dashboard', canActivate: [AuthGuard] },
  { component: Login, path: 'login'},
  { component: Community, path: 'community', canActivate: [AuthGuard]},
  { component: About, path: 'aboutdearme'},
  { component: PrivacyComponent, path: 'privacy' },
  { component: TermsComponent, path: 'terms'},
  { component: CollectStampComponent, path: 'collection', canActivate: [AuthGuard]},
];
