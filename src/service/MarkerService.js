import { MarkerRepository } from "../repository/MarkerRepository.js";
import { Utils } from "./Utils.js";

const utils = new Utils();

export class MarkerService {
    constructor() {
        this._id = 1001;
        this.repo = new MarkerRepository();
        this.deleteMarkersButton = document.getElementById('del-btn');

        this.deleteMarkersButton.addEventListener('click', () => {
            this.repo.deleteAllMarkers();
        });
    }

    addMarker(position /*: latLgn */, map) {

        let marker = utils.newMarker(position, this._id++, map);//_newMarker(position, this._id++, map);

        marker.addListener('click', () => {
            this.repo.setOrDisableOriginMarker(marker);
        });

        marker.addListener('rightclick', () => {
            this.repo.removeMarker(marker);
        });

        this.repo.addMarker(marker);
    }

    getMarkers() {
        return this.repo.getMarkers();
    }
}