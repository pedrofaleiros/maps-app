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

    async displayRoute() {

        const markers = utils.validateMarkers(this.repo.getMarkers());

        if (markers) {

            let res = await this._distanceMatrix(markers);

            if (res) {
                //"distance" or "duration"
                const grafo = this._getGrafo(res, "distance");

                const data = await this._request(grafo);

                const ret = await this._displayRoute(data.route, markers);

                return ret;
            }

            return false;
        } else {
            return false;
        }
    }

    _displayRoute(route, markers) {

        if (!route) {
            return false;
        }

        const origin = { lat: markers[route[0]].position.lat(), lng: markers[route[0]].position.lng() }
        const destination = { lat: markers[route[route.length-1]].position.lat(), lng: markers[route[route.length-1]].position.lng() }
        var waypoints = [];
        for (let i = 1; i < route.length - 1; i++) {
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
                    console.log("routes: ", response);
                    this.directionsRenderer.setDirections(response);
                    
                    resolve(true);
                }).catch((e) => {
                    console.log('ERRO:', e)
                    resolve(false);
                });
        });

    }

    _request(grafo) {

        const url = 'https://3000-pedrofaleiros-teste-e1vb3ta7xnc.ws-us74.gitpod.io/get-route';

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
                .then((data) => {
                    //console.log(data);
                    resolve(data);
                })
                .catch((err) => {
                    console.log(err);
                    resolve(false);
                });
        });
    }

    _getGrafo(response, tipo_str) {

        const rows = response.rows;

        let arestas = [];
        let vertices = rows.length;

        for (let i = 0; i < rows.length; i++) {
            for (let j = i + 1; j < rows.length; j++) {
                if (rows[i].elements[j].status == "OK") {
                    arestas.push([i, j, rows[i].elements[j][`${tipo_str}`].text]);
                }
            }
        }

        const grafo = {
            "vertices": vertices,
            "arestas": arestas
        }

        return grafo;
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

            this.distMatrix.getDistanceMatrix(request, (res, status) => {
                if (status == 'OK') {
                    //console.log(res)
                    resolve(res);
                } else {
                    resolve(false);
                }
            });

        });
    }
}