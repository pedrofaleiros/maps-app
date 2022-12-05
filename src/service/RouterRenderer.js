import { Utils } from "./Utils.js";

const utils = new Utils();

export class RouterRenderer {
    constructor(map) {

        this.directionsService = new google.maps.DirectionsService();

        this.directionsRenderer = new google.maps.DirectionsRenderer();

        this.directionsRenderer.setMap(map);
        this.directionsRenderer.setPanel(document.getElementById('side'));
        this.directionsRenderer.setOptions({
            hideRouteList: true
        });
    }

    displayRoute(route, markers) {

        if (!route) {
            return { "status": 0, 'erro': 'ERRO nos markers Display Route' };
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
}