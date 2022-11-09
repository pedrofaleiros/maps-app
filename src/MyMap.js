import { MapController } from "./controller/MapController.js";
import { MapOptions } from "./mapOptions.js";

const options = new MapOptions();

export class MyMap {

    constructor() {
        this.map = new google.maps.Map(
            document.getElementById("map"),
            options.getOptions()
        );

        this.controller = new MapController(this.map);
    }

    initMap() {
        this.controller.init();
    }
}