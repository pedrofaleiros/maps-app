import { MarkerRepository } from "../repository/MarkerRepository.js";
import { MyDistanceMatrix } from "./MyDistanceMatrix.js";
import { Utils } from "./Utils.js";

const utils = new Utils();

export class DirectionService {
    constructor(map) {
        this.repo = new MarkerRepository();

        this.distanceMatrix = new MyDistanceMatrix(map);
    }

    async calculateRoute() {
        const markers = utils.validateMarkers(this.repo.getMarkers());

        if (markers.status == 1) {
            return await this.distanceMatrix.calculate(markers.data);
        } else {
            return markers;
        }
    }
}