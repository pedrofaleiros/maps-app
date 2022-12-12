import { RequestApi } from "./RequestApi.js";
import { Utils } from "./Utils.js";

const utils = new Utils();

export class MyDistanceMatrix {
    constructor(map) {
        this.distMatrix = new google.maps.DistanceMatrixService();

        this.requestApi = new RequestApi(map);
    }

    calculate(markers) {
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
                        resolve(await this.requestApi.request(grafo, markers));
                    } else {
                        resolve({ 'status': 0, 'erro': 'Erro nos locais escolhidos' });
                    }
                } else {
                    resolve({ 'status': -1, 'erro': 'Erro na API Google' });
                }
            });
        });
    }
}