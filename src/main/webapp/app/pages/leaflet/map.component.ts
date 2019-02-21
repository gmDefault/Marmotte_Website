import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import { icon, latLng, marker, point, polyline, tileLayer } from 'leaflet';
import { Map } from './map.model';
import { MapService } from './map.service';
import { Principal } from 'app/core';

@Component({
    selector: 'jhi-map',
    templateUrl: './map.component.html'
})
export class MapComponent implements OnInit, OnDestroy {
    currentAccount: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;

    // Define our base layers so we can reference them multiple times
    OSMaps = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 20,
        detectRetina: true
    });

    // Marker center of France
    fams1C1 = marker([45.037615, 6.389056], {
        icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-icon-red.png'),
            shadowUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-shadow.png')
        })
    });
    fams1C2 = marker([45.035845, 6.387494], {
        icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-shadow.png')
        })
    });
    fams1C3 = marker([45.034019, 6.390776], {
        icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-icon-green.png'),
            shadowUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-shadow.png')
        })
    });
    fams1C4 = marker([45.034901, 6.391779], {
        icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-icon-orange.png'),
            shadowUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-shadow.png')
        })
    });
    fams2C1 = marker([45.056603, 6.376344], {
        icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-icon-green.png'),
            shadowUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-shadow.png')
        })
    });
    fams2C2 = marker([45.054718, 6.38121], {
        icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-icon-green.png'),
            shadowUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-shadow.png')
        })
    });
    fams2C3 = marker([45.052457, 6.381494], {
        icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-icon-green.png'),
            shadowUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-shadow.png')
        })
    });
    fams3C1 = marker([45.057947, 6.406579], {
        icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-icon-orange.png'),
            shadowUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-shadow.png')
        })
    });
    fams3C2 = marker([45.060063, 6.402048], {
        icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-icon-green.png'),
            shadowUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-shadow.png')
        })
    });
    fams3C3 = marker([45.057757, 6.404297], {
        icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-icon-green.png'),
            shadowUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-shadow.png')
        })
    });
    fams3C4 = marker([45.058259, 6.405863], {
        icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-icon-green.png'),
            shadowUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-shadow.png')
        })
    });
    // Layers
    layersControl = {
        baseLayers: {
            'OS Maps': this.OSMaps
        },
        overlays: {}
    };

    // Set the initial set
    options = {
        layers: [
            this.OSMaps,
            this.fams1C4,
            this.fams2C1,
            this.fams1C1,
            this.fams1C2,
            this.fams1C3,
            this.fams2C2,
            this.fams2C3,
            this.fams3C1,
            this.fams3C2,
            this.fams3C3,
            this.fams3C4
        ],
        zoom: 13,
        center: latLng([45.047465, 6.395786])
    };
    constructor(
        private mapService: MapService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    ngOnInit() {
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
    }

    ngOnDestroy() {}

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
