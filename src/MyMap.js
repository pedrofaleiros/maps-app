import { MapOptions } from "./mapOptions.js";
import { MarkerService } from "./service/MarkerService.js";

const options = new MapOptions();

export class MyMap {

    constructor() {
        this.map = new google.maps.Map(
            document.getElementById("map"),
            options.getOptions('night')
        );
        /* this.autocomplete = new google.maps.places.Autocomplete(
            document.getElementById("autocomplete"),
            options.getAutocompleteOptions()
        ); */
        this.service = new MarkerService();
    }

    initMap() {
        var id = 0;
        this.map.addListener('click', (click) => {
            this.service.addMarker(click.latLng, this.map);
        });

        this.map.addListener('rightclick', () => {
            console.log(this.service.getMarkers());
        });
    }
}