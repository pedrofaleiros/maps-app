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

    removeMarker(id){
        this._markers.forEach((mk, ind)=>{
            if(mk.id === id && mk.isOrigin == false){
                mk.setMap(null);
                this._markers.splice(ind, 1);
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


}