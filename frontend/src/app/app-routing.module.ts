import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DekoraterComponent } from './dekorater/dekorater.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { DekoraterRegisterComponent } from './dekorater-register/dekorater-register.component';
import { OwnerProfileComponent } from './owner-profile/owner-profile.component';
import { CompanyRegisterComponent } from './company-register/company-register.component';
import { DekoraterProfileComponent } from './dekorater-profile/dekorater-profile.component';
import { OwnerCompanyComponent } from './owner-company/owner-company.component';
import { OwnerComponent } from './owner/owner.component';
import { DekoraterSchedulingComponent } from './dekorater-scheduling/dekorater-scheduling.component';

const routes: Routes = [
  {path: '', component: FrontpageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'vlasnik', component: OwnerComponent},
  {path: 'dekorater', component: DekoraterComponent},
  {path: 'login/admin', component: AdminLoginComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'password-change', component: PasswordChangeComponent},
  {path: 'dekorater-register', component: DekoraterRegisterComponent},
  {path: 'owner-profile', component: OwnerProfileComponent},
  {path: 'owner-company', component: OwnerCompanyComponent},
  {path: 'company-register', component: CompanyRegisterComponent},
  {path: 'dekorater-profile', component: DekoraterProfileComponent},
  {path: 'dekorater-scheduling', component: DekoraterSchedulingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
