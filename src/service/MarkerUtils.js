export class MarkerUtils {
    constructor() {

    }

    newMarker(position, id, map) {
        return new google.maps.Marker({
            position: position,
            map: map,
            draggable: false,
            id: id,
            isOrigin: false,
            //animation: google.maps.Animation.BOUNCE,
        });
    }
}