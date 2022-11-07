import { MarkerRepository } from "../repository/MarkerRepository.js";
import { MarkerUtils } from "./MarkerUtils.js";

const utils = new MarkerUtils();

export class MarkerService {
    constructor() {
        this._id = 1001;
        this._markers = [];
        this.repo = new MarkerRepository();
    }

    addMarker(position /*: latLgn */, map) {

        let marker = utils.newMarker(position, this._id++, map);//_newMarker(position, this._id++, map);

        marker.addListener('click', () => {
            console.log(marker.id);
        });

        marker.addListener('rightclick', () => {
            this.repo.removeMarker(marker.id);
        });

        this.repo.addMarker(marker);
    }

    getMarkers(){
        return this.repo.getMarkers();
    }
}