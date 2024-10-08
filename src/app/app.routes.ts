import { Routes } from '@angular/router';
import { TestViewverComponent } from './test-viewver/test-viewver.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent}, 
    { path: 'registration', component:RegistrationComponent },
    { path: 'test/:id', component:TestViewverComponent },
    { path: 'login', component:LoginComponent },
    {path:'**',component:HomePageComponent}

];
