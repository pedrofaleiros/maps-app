import { MyMap } from "./MyMap.js";

function init() {
    const map = new MyMap();
    map.initMap();

    const helpBtn = document.getElementById('help-button');
    helpBtn.addEventListener('click', () => {
        const helpText = document.getElementById('help-text');
        helpText.style.zIndex = '10';
    });

    const backBtn = document.getElementById('back-button');
    backBtn.addEventListener('click', () => {
        const helpText = document.getElementById('help-text');
        helpText.style.zIndex = '0';
    });
}

window.initMap = init;