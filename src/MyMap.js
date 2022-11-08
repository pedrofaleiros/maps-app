import { MapOptions } from "./mapOptions.js";
import { DirectionService } from "./service/DirectionService.js";
import { MarkerService } from "./service/MarkerService.js";

const options = new MapOptions();

export class MyMap {

    constructor() {
        this.map = new google.maps.Map(
            document.getElementById("map"),
            options.getOptions('night')
        );

        this.markerService = new MarkerService();
        this.directionService = new DirectionService();
    }

    initMap() {

        this.map.addListener('click', (click) => {

            if (click.placeId) {
                this.markerService.addMarker(click.latLng, this.map);
            }
        });

        this.map.addListener('rightclick', () => {
            console.log(this.markerService.getMarkers());
        });

        const autocomplete = new google.maps.places.Autocomplete(
            document.getElementById("autocomplete"),
            options.getAutocompleteOptions()
        );
        autocomplete.addListener('place_changed', () => {
            this.addMarkerAutocomplete(autocomplete.getPlace());
        });

        const calculateButton = document.getElementById('action-button');
        calculateButton.addEventListener('click', async () => {

            const res = await this.directionService.displayRoute();

            console.log('res>>>', res);

            if (res) {
                document.getElementById('autocomplete').disabled = true;
            }
        });
    }

    addMarkerAutocomplete(place) {
        document.getElementById('autocomplete').value = '';

        this.markerService.addMarker(place.geometry.location, this.map);
    }
}