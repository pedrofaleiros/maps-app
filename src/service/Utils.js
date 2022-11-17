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

        if (markers.length > 3) {
            let validated_markers = [];

            markers.forEach((mk) => {
                if (mk.isOrigin) {
                    validated_markers.unshift(mk);
                } else {
                    validated_markers.push(mk);
                }
            });

            const ret = validated_markers.map((mk) => {
                return {
                    id: mk.id,
                    isOrigin: mk.isOrigin,
                    position: mk.position
                }
            });

            if(!hasOrigin){
                return {'status':0, 'erro':'Selecione um local de origem'};
            }

            return {'status':1, 'data':ret}
        }

        return {'status':0, 'erro':'Selecione mais de 3 lugares'};
    }

    getGrafo(response, tipo_str) {

        const rows = response.rows;

        let arestas = [];
        let vertices = rows.length;

        for (let i = 0; i < rows.length; i++) {
            for (let j = i + 1; j < rows.length; j++) {
                if (rows[i].elements[j].status == "OK") {
                    arestas.push([i, j, rows[i].elements[j][`${tipo_str}`].text]);
                }else{
                    return false;
                }
            }
        }

        const grafo = {
            "vertices": vertices,
            "arestas": arestas
        }

        return grafo;
    }
}