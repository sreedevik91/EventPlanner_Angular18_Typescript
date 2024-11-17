import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { authGuard } from './guards/authGuard/auth.guard';
import { ResetComponent } from './components/reset/reset.component';
import { SubmitOtpComponent } from './components/submit-otp/submit-otp.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'reset/:token',
        component:ResetComponent,
    },
    {
        path:'otp/:id',
        component:SubmitOtpComponent,
    },
    {
        path:'home',
        component:HomeComponent,
        canActivate:[authGuard]
    },
    {
        path:'',
        component:LayoutComponent,
        children:[
            {
                path:'dashboard',
                component:DashboardComponent,
                canActivate:[authGuard]
            },
           
        ]
    },
    {
        path:'**',
        component:PageNotFoundComponent
    }
];
