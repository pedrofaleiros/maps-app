import { MarkerRepository } from "../repository/MarkerRepository.js";
import { Utils } from "./Utils.js";

const utils = new Utils();

export class DirectionService {
    constructor(map) {
        this.repo = new MarkerRepository();
        this.distMatrix = new google.maps.DistanceMatrixService();

        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(map);
    }

    async calculateRoute() {

        const markers = utils.validateMarkers(this.repo.getMarkers());

        if (markers) {

            return await this._distanceMatrix(markers);
        } else {
            return false;
        }
    }

    _displayRoute(route, markers) {

        if (!route) {
            return false;
        }

        const origin = { lat: markers[route[0]].position.lat(), lng: markers[route[0]].position.lng() }
        const destination = { lat: markers[route[route.length-2]].position.lat(), lng: markers[route[route.length-2]].position.lng() }
        var waypoints = [];
        for (let i = 1; i < route.length - 2; i++) {
            waypoints.push(
                { location: `${markers[route[i]].position.lat()}, ${markers[route[i]].position.lng()}` }
            )
        }

        const routeOpt = {
            origin: origin,
            destination: destination,
            waypoints: waypoints,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING,
        }

        return new Promise((resolve, reject) => {
            this.directionsService.route(routeOpt)
                .then((response) => {
                    this.directionsRenderer.setDirections(response);
                    resolve(true);
                }).catch((e) => {
                    console.log('ERRO:', e)
                    resolve(false);
                });
        });

    }

    _request(grafo, markers) {

        const url = "http://localhost:3000"+'/get-route';

        const opt = {
            //mode: 'cors', // no-cors, *cors, same-origin
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(grafo)
        };

        return new Promise((resolve, reject) => {
            fetch(url, opt)
                .then((res) => {
                    return res.json();
                })
                .then(async (data) => {
                    resolve(await this._displayRoute(data.rota, markers));
                })
                .catch((err) => {
                    console.log('request', err);
                    resolve(false);
                });
        });
    }

    _distanceMatrix(markers) {

        const places = markers.map((mk) => {
            return {
                "lat": mk.position.lat(),
                "lng": mk.position.lng()
            };
        });

        const request = {
            origins: places,
            destinations: places,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
        };

        return new Promise((resolve, reject) => {

            this.distMatrix.getDistanceMatrix(request, async (res, status) => {
                if (status == 'OK') {
                    const grafo = utils.getGrafo(res, "distance");
                    if(grafo){
                        resolve(await this._request(grafo, markers));
                    }
                } else {
                    resolve(false);
                    console.log("dist Matrix");
                }
            });

        });
    }
}