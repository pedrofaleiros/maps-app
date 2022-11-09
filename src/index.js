import { MyMap } from "./MyMap.js";

function init() {
    const map = new MyMap();
    
    map.initMap();
}

window.initMap = init;