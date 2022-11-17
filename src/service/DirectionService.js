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
        this.directionsRenderer.setPanel(document.getElementById('side'));
        this.directionsRenderer.setOptions({
            hideRouteList: true
        });
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
        const destination = { lat: markers[route[route.length - 1]].position.lat(), lng: markers[route[route.length - 1]].position.lng() }
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
                    console.log('response', response);
                    this.directionsRenderer.setDirections(response);

                    const directions = this.directionsRenderer.getDirections();

                    if (directions) {
                        this.computeTotalDistance(directions);
                    }

                    resolve(true);
                }).catch((e) => {
                    console.log('ERRO:', e)
                    resolve(false);
                });
        });
    }

    computeTotalDistance(result) {
        let total = 0;
        let time = 0;
        const myroute = result.routes[0];
      
        if (!myroute) {
          return;
        }

        console.log('route>>>>', myroute);
      
        for (let i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
          time += myroute.legs[i].duration.value;
        }

        time = time/60;
      
        total = total / 1000;

        const distance = document.getElementById("total");
        distance.style.color = '#fff';
        (document.getElementById('distancia')).style.color = '#fff';
        distance.innerHTML = total + " km";
      }

    _request(grafo, markers) {

        const url = "https://api-route.herokuapp.com/" + 'get-route';

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
                    console.log(data);
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
                    console.log('res', res);
                    console.log('grafo', grafo);
                    if (grafo) {
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