import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/guards/auth.guard';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactDetailsComponent } from './components/contacts/contact-details/contact-details.component';
import { ContactResolver } from './shared/resolvers/contact.resolver';
import { GuestGuard } from './shared/guards/guest.guard';
import { LoginComponent } from './components/auth/login/login.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/contacts',
    pathMatch: 'full'
  },
  {
    path: 'contacts',
    canActivate: [AuthGuard],
    component: ContactsComponent,
    children: [
      {
        path: ':id',
        component: ContactDetailsComponent,
        resolve: {
          contact: ContactResolver
        }
      }
    ]
  },
  {
    path: 'login',
    canActivate: [GuestGuard],
    component: LoginComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
