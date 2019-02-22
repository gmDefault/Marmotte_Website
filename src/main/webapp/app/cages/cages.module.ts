import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CAGES_ROUTE, CagesComponent } from './';
import { MarmotteSharedModule } from 'app/shared';

@NgModule({
    imports: [MarmotteSharedModule, RouterModule.forChild([CAGES_ROUTE])],
    declarations: [CagesComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MarmotteCagesModule {}
// JHipster Stripe Module will add new line here
