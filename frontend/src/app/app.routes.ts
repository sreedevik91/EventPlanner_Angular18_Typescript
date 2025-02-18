import { Routes } from '@angular/router';
// import { LoginComponent } from './components/login/login.component';
// import { LayoutComponent } from './components/layout/layout.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { authGuard } from './guards/authGuard/auth.guard';
// import { ResetComponent } from './components/reset/reset.component';
// import { SubmitOtpComponent } from './components/submit-otp/submit-otp.component';
// import { UsersComponent } from './components/users/users.component';
// import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
// import { GoogleAuthCallbackComponent } from './components/google-auth-callback/google-auth-callback.component';
// import { EventServicesComponent } from './components/event-services/event-services.component';
// import { EventsComponent } from './components/events/events.component';
// import { UserServiceDetailsComponent } from './components/user-service-details/user-service-details.component';
// import { UserEventDetailsComponent } from './components/user-event-details/user-event-details.component';
// import { BookingComponent } from './components/booking/booking.component';
// import { ChatComponent } from './components/chat/chat.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        // component:LoginComponent,
        loadComponent: () => import('../app/components/login/login.component')
    },
    {
        path: 'googleLogin/callback',
        // component:GoogleAuthCallbackComponent,
        loadComponent: () => import('../app/components/google-auth-callback/google-auth-callback.component')
    },
    {
        path: 'reset/:token',
        // component: ResetComponent,
        loadComponent: () => import('../app/components/reset/reset.component')
    },
    {
        path: 'verifyEmail',
        // component:VerifyEmailComponent,
        loadComponent: () => import('../app/components/verify-email/verify-email.component')
    },
    {
        path: 'otp/:id',
        // component:SubmitOtpComponent,
        loadComponent: () => import('../app/components/submit-otp/submit-otp.component')
    },
    {
        path: '',
        // component:LayoutComponent,
        // loadComponent: () => import('../app/components/layout/layout.component'),
        loadChildren: () => import('../app/model/constants/childRoutes')
        // children:[
        //     {
        //         path:'dashboard',
        //         component:DashboardComponent,
        //         canActivate:[authGuard]
        //     },
        //     {
        //         path:'users',
        //         component:UsersComponent,
        //         canActivate:[authGuard]
        //     },
        //     {
        //         path:'services',
        //         component:EventServicesComponent,
        //         canActivate:[authGuard]
        //     },
        //     {
        //         path:'events',
        //         component:EventsComponent,
        //         canActivate:[authGuard]
        //     },
        //     {
        //         path:'booking',
        //         component:BookingComponent,
        //         canActivate:[authGuard]
        //     },
        //     {
        //         path:'services/details',
        //         component:UserServiceDetailsComponent,
        //         canActivate:[authGuard]
        //     },
        //     {
        //         path:'events/details',
        //         component:UserEventDetailsComponent,
        //         canActivate:[authGuard]
        //     },
        //     {
        //         path:'chat',
        //         component:ChatComponent,
        //         canActivate:[authGuard]
        //     }

        // ]
    },
    {
        path: '**',
        // component:PageNotFoundComponent,
        redirectTo: 'login'
    }
];
