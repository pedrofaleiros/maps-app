export class Utils {
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

    validateMarkers(markers) {

        let hasOrigin = false;

        markers.forEach((mk) => {
            if (mk.isOrigin) {
                hasOrigin = true;
            }
        });

        // mudar
        if (markers.length > 1 && hasOrigin) {
            let validated_markers = [];

            markers.forEach((mk) => {
                if (mk.isOrigin) {
                    validated_markers.unshift(mk);
                } else {
                    validated_markers.push(mk);
                }
            });

            return validated_markers.map((mk) => {
                return {
                    id: mk.id,
                    isOrigin: mk.isOrigin,
                    position: mk.position
                }
            });
        }

        return false;
    }
}