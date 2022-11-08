import { MarkerRepository } from "../repository/MarkerRepository.js";
import { Utils } from "./Utils.js";

const utils = new Utils();

export class DirectionService {
    constructor() {
        this.repo = new MarkerRepository();
        this.distMatrix = new google.maps.DistanceMatrixService();
    }

    async displayRoute() {

        const markers = utils.validateMarkers(this.repo.getMarkers());

        if (markers) {

            return await this._distanceMatrix(markers);
        } else {
            return false;
        }
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

        return new Promise((resolve, reject)=>{

            this.distMatrix.getDistanceMatrix(request, (res, status)=>{
                if(status == 'OK'){
                    console.log(res)
                    resolve(true);
                }else{
                    resolve(false);
                }
            });

        });
    }
}