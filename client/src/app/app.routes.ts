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
import { BlogList } from './pages/blog/blog-list/blog-list';
import { BlogDetail } from './pages/blog/blog-detail/blog-detail';
import { Store } from './pages/store/store';
import { ProductDetail } from './components/product-detail/product-detail';

export const routes: Routes = [
  { component: Home, path: '' },
  { component: Dashboard, path: 'dashboard', canActivate: [AuthGuard] },
  { component: Login, path: 'login' },
  { component: Community, path: 'community', canActivate: [AuthGuard] },
  { component: About, path: 'aboutdearme' },
  { component: PrivacyComponent, path: 'privacy' },
  { component: TermsComponent, path: 'terms' },
  {
    component: CollectStampComponent,
    path: 'collection',
    canActivate: [AuthGuard],
  },
  {
    path: 'blog',
    children: [
      { path: '', component: BlogList },
      { path: ':slug', component: BlogDetail },
    ],
  },
  {
    component: Store, path: 'store'
  },
  {
    component: ProductDetail, path: 'store/product/:id'
  }
];
