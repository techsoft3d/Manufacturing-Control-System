modelUIDs = [
        "a35ee3a0-62ba-43bf-a449-fd563ee3b737" //moto
]

async function startViewer() {
        const conversionServiceURI = "https://csapi.techsoft3d.com";

        var viewer;

        let res = await fetch(conversionServiceURI + '/api/streamingSession');
        var data = await res.json();

        var endpointUriBeginning = 'ws://';

        if(conversionServiceURI.substring(0, 5).includes("https")){
                endpointUriBeginning = 'wss://'
        }

        await fetch(conversionServiceURI + '/api/enableStreamAccess/' + data.sessionid, { method: 'put', headers: { 'items': JSON.stringify(modelUIDs) } });

       
        await fetch(conversionServiceURI + '/api/enableStreamAccess/' +  data.sessionid, { method: 'put', headers: { 'CS-API-Arg': JSON.stringify({subDirectory:"moto_parts" }), 'items': JSON.stringify(["0f248a5d-2366-44e3-9c48-2b64b7264d2e"]) } });
   
     
        viewer = new Communicator.WebViewer({
                containerId: "theCanvas",
                endpointUri: endpointUriBeginning + data.serverurl + ":" + data.port + '?token=' + data.sessionid,
                model: "moto",
                enginePath: "https://cdn.jsdelivr.net/gh/techsoft3d/hoops-web-viewer@latest",
                rendererType: 0
        });

        viewer.start();

        return viewer;

}


