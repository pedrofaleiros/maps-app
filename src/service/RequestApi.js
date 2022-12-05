import { RouteRender } from "./RouteRender.js";

export class RequestApi {
    
    constructor(map){
        this.routeRender = new RouteRender(map);
    }
    
    request(grafo, markers) {

        const url = "https://api-routes-rosy-six.vercel.app/" + 'get-route';

        const opt = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(grafo)
        };

        return new Promise((resolve, reject) => {
            fetch(url, opt)
                .then((res) => {
                    return res.json();
                })
                .then(async (data) => {
                    resolve(await this.routeRender.displayRoute(data.rota, markers));
                })
                .catch((err) => {
                    resolve({ 'status': 0, 'erro': 'ERRO no request da API - ' + err });
                });
        });
    }
}