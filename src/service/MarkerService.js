import { MarkerRepository } from "../repository/MarkerRepository.js";
import { Utils } from "./Utils.js";

const utils = new Utils();

export class MarkerService {
    constructor() {
        this._id = 1001;
        this.repo = new MarkerRepository();

        this.lugares = [];
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

        setTimeout(() => {
            const aux = document.getElementsByClassName('title full-width');
            // console.log(aux[0].innerHTML)
            this.lugares.push({nome: aux[0].innerHTML, id: marker.id});

        }, 200);
    }

    getMarkers() {
        return this.repo.getMarkers();
    }

    getLugares() {
        return this.lugares
    }

    deleteAllMarkers() {
        this.repo.deleteAllMarkers();
    }
}