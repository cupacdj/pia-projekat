import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { DekoraterComponent } from './dekorater/dekorater.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { DekoraterRegisterComponent } from './dekorater-register/dekorater-register.component';
import { HeaderLoginComponent } from './header-login/header-login.component';
import { OwnerMenuComponent } from './owner-menu/owner-menu.component';
import { OwnerProfileComponent } from './owner-profile/owner-profile.component';
import { CompanyRegisterComponent } from './company-register/company-register.component';
import { DekoraterMenuComponent } from './dekorater-menu/dekorater-menu.component';
import { DekoraterProfileComponent } from './dekorater-profile/dekorater-profile.component';
import { OwnerCompanyComponent } from './owner-company/owner-company.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FrontpageComponent,
    VlasnikComponent,
    DekoraterComponent,
    AdminComponent,
    AdminLoginComponent,
    HeaderComponent,
    FooterComponent,
    PasswordChangeComponent,
    DekoraterRegisterComponent,
    HeaderLoginComponent,
    OwnerMenuComponent,
    OwnerProfileComponent,
    CompanyRegisterComponent,
    DekoraterMenuComponent,
    DekoraterProfileComponent,
    OwnerCompanyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
