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

        if (markers.status == 1) {

            return await this._distanceMatrix(markers.data);
        } else {
            return markers;
        }
    }

    _displayRoute(route, markers) {

        if (!route) {
            return {"status":0, 'erro':'ERRO nos markers Display Route'};
        }

        const origin = { lat: markers[route[0]].position.lat(), lng: markers[route[0]].position.lng() }
        const destination = { lat: markers[route[route.length - 2]].position.lat(), lng: markers[route[route.length - 2]].position.lng() }
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
                    // console.log('response', response);
                    this.directionsRenderer.setDirections(response);

                    const directions = this.directionsRenderer.getDirections();

                    if (directions) {
                        utils.computeTotalDistance(directions);
                    }

                    resolve({ 'status': 1 });
                }).catch((err) => {
                    resolve({ 'status': 0, 'erro': 'display route' + err });
                });
        });
    }

    _request(grafo, markers) {

        const url = "https://api-routes-rosy-six.vercel.app/" + 'get-route';

        const opt = {
            method: 'POST',
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
                    resolve({ 'status': 0, 'erro': 'ERRO no request da API - ' + err });
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
                    if (grafo) {
                        resolve(await this._request(grafo, markers));
                    }else{
                        resolve({ 'status': 0, 'erro': 'Erro nos locais escolhidos' });
                    }
                } else {
                    resolve({ 'status': 0, 'erro': 'Erro na API Google' });
                }
            });
        });
    }
}