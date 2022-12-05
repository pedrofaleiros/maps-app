export class MarkerRepository {
    constructor() {

        if (!MarkerRepository.instance) {
            MarkerRepository.instance = this;
        }

        this._hasOrigin = false;
        this._markers = [];

        this._originIcon = 'https://cdn-icons-png.flaticon.com/32/727/727590.png';

        return MarkerRepository.instance;
    }

    addMarker(marker) {
        this._markers.push(marker);
    }

    removeMarker(marker) {
        this._markers.forEach((mk, ind) => {
            if (mk.id === marker.id) {
                if (mk.isOrigin) {
                    this._hasOrigin = false;
                }
                mk.setMap(null);
                this._markers.splice(ind, 1);
            }
        });
    }

    setOrDisableOriginMarker(marker) {

        if (marker.isOrigin) {
            this._disableOriginMarker(marker);
        } else {
            if (this._hasOrigin == false) {
                this._setOriginMarker(marker);
            }
        }
    }

    _disableOriginMarker(marker) {
        this._markers.forEach((mk) => {
            if (mk.id == marker.id) {
                mk.isOrigin = false;
                mk.setIcon(undefined);
                this._hasOrigin = false;
            }
        });
    }

    _setOriginMarker(marker) {
        this._markers.forEach((mk) => {
            if (mk.id == marker.id) {
                mk.isOrigin = true;
                mk.setIcon(this._originIcon);
                this._hasOrigin = true;
            }
        });

    }

    getMarkers() {
        return this._markers.map((mk) => {
            return {
                id: mk.id,
                position: mk.position,
                isOrigin: mk.isOrigin
            }
        });
    }

    deleteAllMarkers() {

        this._markers.forEach((mk) => {
            mk.setAnimation(google.maps.Animation.BOUNCE);

            window.setTimeout(() => {
                mk.setMap(null);
            }, 300);
        })

        this._hasOrigin = false;
        this._markers = [];
    }

}