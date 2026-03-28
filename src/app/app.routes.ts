import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout';
import { DashboardComponent } from './features/dashboard';


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
      // {
      //   path: 'alumnos',
      //   loadComponent: () =>
      //     import('./features/members/members-list/members-list.component')
      //       .then(m => m.MembersListComponent),
      //   title: 'Alumnos — Pilates Studio'
      // },
      // {
      //   path: 'pagos',
      //   loadComponent: () =>
      //     import('./features/payments/payments.component')
      //       .then(m => m.PaymentsComponent),
      //   title: 'Pagos — Pilates Studio'
      // },
      // {
      //   path: 'patologias',
      //   loadComponent: () =>
      //     import('./features/pathologies/pathologies.component')
      //       .then(m => m.PathologiesComponent),
      //   title: 'Patologías — Pilates Studio'
      // },
      // {
      //   path: 'clases',
      //   loadComponent: () =>
      //     import('./features/classes/classes.component')
      //       .then(m => m.ClassesComponent),
      //   title: 'Clases — Pilates Studio'
      // },
      // {
      //   path: 'planes',
      //   loadComponent: () =>
      //     import('./features/membership-plans/membership-plans.component')
      //       .then(m => m.MembershipPlansComponent),
      //   title: 'Planes — Pilates Studio'
      // }
    ]
  },
  { path: '**', redirectTo: '' }
];
