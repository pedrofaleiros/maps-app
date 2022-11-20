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
    this.addDeleteMarkersListener();
  }

  addMapListeners() {
    this.map.addListener("click", (click) => {
      if (click.placeId && !this.trava) {
        this.markerService.addMarker(click.latLng, this.map, null);
      }
    });
    this.map.addListener("rightclick", () => {
      console.log("lugares:");
      this.markerService.getLugares().map((e) => console.log(e));
    });
  }

  addDeleteMarkersListener() {
    const deleteMarkersButton = document.getElementById("del-btn");
    deleteMarkersButton.addEventListener("click", () => {
      this.markerService.deleteAllMarkers();
    });
  }

  addAutocompleteListener() {
    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      options.getAutocompleteOptions()
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      console.log(place);

      document.getElementById("autocomplete").value = "";
      this.map.setCenter(place.geometry.location);
      this.markerService.addMarker(
        place.geometry.location,
        this.map,
        place.name
      );
    });
  }

  clicouButton() {
    document.getElementById("tut").style.display = "flex";
    document.getElementById("text-container").style.display = "none";
    document.getElementById("loading").style.display = "flex";
  }

  addPainel() {
    document.getElementById("auto").style.display = "none";
    document.getElementById("loading").style.display = "none";
    document.getElementById("rest-btn").style.display = "flex";
    document.getElementById("del-btn").style.display = "none";
    document.getElementById("tut").style.display = "none";
    calculateButton.style.display = "none";
    this.addRestartButtonListener();
  }

  voltaTutorial() {
    document.getElementById("tut").style.display = "block";
    document.getElementById("text-container").style.display = "block";
    document.getElementById("loading").style.display = "none";
  }

  addButtonListener() {
    const calculateButton = document.getElementById("action-button");
    calculateButton.addEventListener("click", async () => {
      this.clicouButton();

      const res = await this.directionService.calculateRoute();

      if (res.status == 1) {
        this.markerService.deleteAllMarkers();
        this.trava = true;
      } else {
        this.voltaTutorial();
        alert(res.erro);
      }
    });
  }

  addRestartButtonListener() {
    const restButton = document.getElementById("rest-btn");
    restButton.addEventListener("click", () => {
      window.location.reload(true);
    });
  }

  /* addHelpListener() {
        const helpBtn = document.getElementById('help-button');
        helpBtn.addEventListener('click', () => {
            const helpText = document.getElementById('help-text');
            if (helpText.style.display == 'block') {
                helpText.style.display = 'none'
            } else {
                helpText.style.display = 'block';
            }
        });

        const backBtn = document.getElementById('back-button');
        backBtn.addEventListener('click', () => {
            const helpText = document.getElementById('help-text');
            helpText.style.display = 'none';
        });
    } */
}
