import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as moment from 'moment';
import { LoginModalService, AccountService, Account } from 'app/core';

@Component({
    selector: 'jhi-cages',
    templateUrl: './cages.component.html',
    styleUrls: ['cages.scss']
})
export class CagesComponent implements OnInit {
    constructor(private accountService: AccountService) {}

    ngOnInit() {}
}
