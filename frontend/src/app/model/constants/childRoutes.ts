
import { Routes } from '@angular/router';
import { authGuard } from '../../guards/authGuard/auth.guard';

const childRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('../../components/layout/layout.component'),
        children: [
            {
                path: 'dashboard',
                // component:DashboardComponent,
                loadComponent: () => import('../../components/dashboard/dashboard.component'),
                canActivate: [authGuard]
            },
            {
                path: 'users',
                // component:UsersComponent,
                loadComponent: () => import('../../components/users/users.component'),
                canActivate: [authGuard]
            },
            {
                path: 'services',
                // component:EventServicesComponent,
                loadComponent: () => import('../../components/event-services/event-services.component'),
                canActivate: [authGuard]
            },
            {
                path: 'events',
                // component:EventsComponent,
                loadComponent: () => import('../../components/events/events.component'),
                canActivate: [authGuard]
            },
            {
                path: 'booking',
                // component:BookingComponent,
                loadComponent: () => import('../../components/booking/booking.component'),
                canActivate: [authGuard]
            },
            {
                path: 'services/details',
                // component:UserServiceDetailsComponent,
                loadComponent: () => import('../../components/user-service-details/user-service-details.component'),
                canActivate: [authGuard]
            },
            {
                path: 'events/details',
                // component:UserEventDetailsComponent,
                loadComponent: () => import('../../components/user-event-details/user-event-details.component'),
                canActivate: [authGuard]
            },
            {
                path: 'chat',
                // component:ChatComponent,
                loadComponent: () => import('../../components/chat/chat.component'),
                canActivate: [authGuard]
            }

        ]
    }
]

export default childRoutes