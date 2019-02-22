import { Route } from '@angular/router';

import { CagesComponent } from './';

export const CAGES_ROUTE: Route = {
    path: 'cages',
    component: CagesComponent,
    data: {
        authorities: [],
        pageTitle: 'localversionApp.cages.title'
    }
};
