
import { Routes } from '@angular/router';
import { authGuard } from '../../guards/authGuard/auth.guard';

const childRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('../../components/layout/layout.component'),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('../../components/dashboard/dashboard.component'),
                canActivate: [authGuard]
            },
            {
                path: 'users',
                loadComponent: () => import('../../components/users/users.component'),
                canActivate: [authGuard]
            },
            {
                path: 'services',
                loadComponent: () => import('../../components/event-services/event-services.component'),
                canActivate: [authGuard]
            },
            {
                path: 'events',
                loadComponent: () => import('../../components/events/events.component'),
                canActivate: [authGuard]
            },
            {
                path: 'booking',
                loadComponent: () => import('../../components/booking/booking.component'),
                canActivate: [authGuard]
            },
            {
                path: 'services/details',
                loadComponent: () => import('../../components/user-service-details/user-service-details.component'),
                canActivate: [authGuard]
            },
            {
                path: 'events/details',
                loadComponent: () => import('../../components/user-event-details/user-event-details.component'),
                canActivate: [authGuard]
            },
            {
                path: 'chat',
                loadComponent: () => import('../../components/chat/chat.component'),
                canActivate: [authGuard]
            },
            {
                path:'favourites',
                loadComponent:()=>import('../../components/user-favorites/user-favorites.component'),
                canActivate: [authGuard]
            },
            {
                path:'sales',
                loadComponent:()=>import('../../components/sales/sales.component'),
                canActivate: [authGuard]
            },
            {
                path:'wallet',
                loadComponent:()=>import('../../components/user-wallet/user-wallet.component'),
                canActivate: [authGuard]
            }

        ]
    }
]

export default childRoutes