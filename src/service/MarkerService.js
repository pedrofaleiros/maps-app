import { MarkerRepository } from "../repository/MarkerRepository.js";
import { Utils } from "./Utils.js";

const utils = new Utils();

export class MarkerService {
    constructor() {
        this._id = 1001;
        this.repo = new MarkerRepository();

        this.lugares = [];
    }

    addMarker(position /*: latLgn */, map, name) {

        let marker = utils.newMarker(position, this._id++, map);

        marker.addListener('click', () => {
            this.repo.setOrDisableOriginMarker(marker);
        });

        marker.addListener('rightclick', () => {
            this.repo.removeMarker(marker);
        });

        setTimeout(() => {
            if (name == null) {
                const aux = document.getElementsByClassName('title full-width');
                this.lugares.push({ nome: aux[0].innerHTML, id: marker.id });

                name = aux[0].innerHTML;
            } else {
                this.lugares.push({ nome: name, id: marker.id });
            }

            marker.name = name;

            const infowindow = new google.maps.InfoWindow({
                content: '<div><strong>'+marker.name+'</strong></div>',
            });
    
            marker.addListener('mouseover', () => {
                infowindow.open({
                    anchor: marker,
                    map,
                });
            });
    
            marker.addListener('mouseout', ()=>{
                infowindow.close()
            });
        }, 100);

        this.repo.addMarker(marker);
    }

    getMarkers() {
        return this.repo.getMarkers();
    }

    deleteAllMarkers() {
        this.repo.deleteAllMarkers();
    }
    
    /* getLugares() {
        return this.lugares
    } */
}