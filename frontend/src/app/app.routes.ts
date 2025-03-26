import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { authGuard } from './guards/authGuard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('../app/components/login/login.component')
    },
    {
        path: 'googleLogin/callback',
        loadComponent: () => import('../app/components/google-auth-callback/google-auth-callback.component')
    },
    {
        path: 'reset/:token',
        loadComponent: () => import('../app/components/reset/reset.component')
    },
    {
        path: 'verifyEmail',
        loadComponent: () => import('../app/components/verify-email/verify-email.component')
    },
    {
        path: 'otp/:id',
        loadComponent: () => import('../app/components/submit-otp/submit-otp.component')
    },
    {
        path: '',
        loadChildren: () => import('../app/model/constants/childRoutes')
       
    }
];
