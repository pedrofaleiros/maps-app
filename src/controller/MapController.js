import { MarkerService } from "../service/MarkerService.js";
import { MapOptions } from "../mapOptions.js";
import { DirectionService } from "../service/DirectionService.js";

const options = new MapOptions();

export class MapController {
    constructor(map) {
        this.map = map;
        this.markerService = new MarkerService();
        this.directionService = new DirectionService(this.map);
        this.trava = false;
    }

    init() {
        this.addListeners();
    }

    addListeners() {
        this.addMapListeners();
        this.addButtonListener();
        this.addAutocompleteListener();
        this.addHelpListener();
        this.addDeleteMarkersListener();
    }

    addMapListeners() {
        this.map.addListener('click', (click) => {
            if (click.placeId && !this.trava) {
                this.markerService.addMarker(click.latLng, this.map, null);
            }
        });
        this.map.addListener('rightclick', () => {
            console.log('lugares:')
            this.markerService.getLugares().map((e)=>console.log(e));
        });
    }

    addDeleteMarkersListener(){
        const deleteMarkersButton = document.getElementById('del-btn');
        deleteMarkersButton.addEventListener('click', () => {
            this.markerService.deleteAllMarkers();
        });
    }

    addAutocompleteListener() {
        const autocomplete = new google.maps.places.Autocomplete(
            document.getElementById("autocomplete"),
            options.getAutocompleteOptions()
        );
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            console.log(place);
            
            document.getElementById('autocomplete').value = '';
            this.map.setCenter(place.geometry.location);
            this.markerService.addMarker(place.geometry.location, this.map, place.name);
        });
    }

    addButtonListener() {
        const calculateButton = document.getElementById('action-button');
        calculateButton.addEventListener('click', async () => {
            const res = await this.directionService.calculateRoute();

            if (res) {
                document.getElementById('autocomplete').disabled = true;
                this.markerService.deleteAllMarkers();

                this.trava = true;
                
                document.getElementById('rest-icon').style.display = 'flex';
                document.getElementById('del-icon').style.display = 'none';
                calculateButton.style.display = 'none';
                this.addRestartButtonListener();
            }
        });
    }

    addRestartButtonListener() {
        const restButton = document.getElementById('rest-btn');
        restButton.addEventListener('click', () => {
            window.location.reload(true);
        });
    }

    addHelpListener() {
        const helpBtn = document.getElementById('help-button');
        helpBtn.addEventListener('click', () => {
            const helpText = document.getElementById('help-text');
            if (helpText.style.zIndex == '10') {
                helpText.style.zIndex = '0'
            } else {
                helpText.style.zIndex = '10';
            }
        });

        const backBtn = document.getElementById('back-button');
        backBtn.addEventListener('click', () => {
            const helpText = document.getElementById('help-text');
            helpText.style.zIndex = '0';
        });
    }
}