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
        overlays: {
            'Marmotte capturée': this.fams1C2,
            'Cage ouverte': this.fams1C3,
            "Marmotte capturée (attente d'intervention)": this.fams3C1
        }
    };

    // Set the initial set
    options = {
        layers: [this.OSMaps, this.fams2C1, this.fams2C2, this.fams2C3, this.fams3C1, this.fams3C2, this.fams3C3, this.fams3C4],
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
        const text_blue =
            '<strong>Marmotte capturée :</strong><br>Temps depuis la capture : <span style="color:red">12min42sec</span><br>Opérateur en intervention : <span style="color:blue"> Vincent </span>';
        const text_red =
            '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFTIzf_HOqP3VW3sM0ZAcYMVQWmZwULGJ5CBl5ynJP1cYv-HyRGA" alt="Warning" width="20" height="20"> <strong>Panne détectée :</strong> <br>' +
            'Niveau de batterie faible :<span style="color:red"> 15 % </span><br>Temps restant estimé : <span style="color:red">35 minutes </span><br>Opération nécessaire : <span style="color:red">changer la batterie</span>';
        const text_green =
            '<strong>Cage ouverte :</strong> <br>Date ouverture :<span style="color:blue"> 25/02/19 9:36 </span><br>Durée ouverture :<span style="color:blue"> 1h36 </span><br>Etat du signal : <img src="data:image/png;base64,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" alt="OK" width="20" height="20"> <br>Niveau de batterie : <span style="color:green">74 %</span><br> Température : <span style="color:red"> 31 °C</span>';
        const text_orange =
            '<img src="https://t3.ftcdn.net/jpg/01/18/40/82/240_F_118408276_IsbEXE8Ti3k1DCDuVCK5OjXhIkM38AhH.jpg" alt="Girl in a jacket" width="30" height="30"> <strong>Marmotte capturée :</strong><br>Temps depuis la capture : <span style="color:red">5 min 24 sec</span><br>Opérateur en intervention : <span style="color:red"> <strong>AUCUN </strong></span><br>Opérateur le plus proche : <span style="color:blue"> Elodie </span>';
        this.options.layers.push(this.fams1C1.bindPopup(text_red));
        this.options.layers.push(this.fams1C2.bindPopup(text_blue));
        this.options.layers.push(this.fams1C3.bindPopup(text_green));
        this.options.layers.push(this.fams1C4.bindPopup(text_orange));
        this.options.layers.push(this.fams2C1.bindPopup(text_green));
        this.options.layers.push(this.fams2C2.bindPopup(text_green));
        this.options.layers.push(this.fams2C3.bindPopup(text_green));
        this.options.layers.push(this.fams3C1.bindPopup(text_orange));
        this.options.layers.push(this.fams3C2.bindPopup(text_green));
        this.options.layers.push(this.fams3C3.bindPopup(text_green));
        this.options.layers.push(this.fams3C4.bindPopup(text_green));
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
