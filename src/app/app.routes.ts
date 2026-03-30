import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout';
import { DashboardComponent } from './features/dashboard';
import { PathologiesList } from './components/pathologies-list/pathologies-list';
import { ClassesList } from './components/classes-list/classes-list';
import { MembershipPlansList } from './components/membership-plans-list/membership-plans-list';


export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard')
            .then(m => m.DashboardComponent),
        title: 'Dashboard — Pilates Studio'
      },
       {
         path: 'alumnos',
         loadComponent: () =>
           import('./components/member-list/member-list')
             .then(m => m.MemberList),
         title: 'Alumnos — Pilates Studio'
       },
       {
         path: 'pagos',
         loadComponent: () =>
           import('./components/payments-list/payments-list')
             .then(m => m.PaymentsList),
         title: 'Pagos — Pilates Studio'
       },
       {
         path: 'patologias',
         loadComponent: () =>
           import('./components/pathologies-list/pathologies-list')
             .then(m => m.PathologiesList),
         title: 'Patologías — Pilates Studio'
       },
       {
         path: 'clases',
         loadComponent: () =>
           import('./components/classes-list/classes-list')
             .then(m => m.ClassesList),
         title: 'Clases — Pilates Studio'
       },
       {
         path: 'planes',
         loadComponent: () =>
           import('./components/membership-plans-list/membership-plans-list')
             .then(m => m.MembershipPlansList),
         title: 'Planes — Pilates Studio'
       },
       {
        path: 'estadisticas',
        loadComponent: () =>
           import('./components/stats/stats')
            .then(m => m.Stats),
        title: 'Estadísticas — Pilates Studio'
},
    ]
  },
  { path: '**', redirectTo: '' }
];
