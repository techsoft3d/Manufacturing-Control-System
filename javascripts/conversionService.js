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
                enginePath: "https://cdn.jsdelivr.net/gh/techsoft3d/hoops-web-viewer",
                rendererType: 0
        });

        viewer.start();

        return viewer;

}

async function fetchVersionNumber() {
        const conversionServiceURI = "https://csapi.techsoft3d.com";

        let res = await fetch(conversionServiceURI + '/api/hcVersion');
        var data = await res.json();
        versionNumer = data;
        
        return data

}

async function initializeViewer() {
        var screenConfiguration =
      Sample.screenConfiguration == "mobile"
        ? Communicator.ScreenConfiguration.Mobile
        : Communicator.ScreenConfiguration.Desktop;

    viewer = await startViewer()
    viewer.setCallbacks({
      selection: function (selection) {
        propertyWindow.onSelection(selection);
      },
      sceneReady: function () {
        viewer
          .getView()
          .setBackgroundColor(
            new Communicator.Color(235, 235, 235),
            new Communicator.Color(179, 179, 179)
          );
        var camera = viewer.getView().getCamera().copy();
        var cam_pos = new Communicator.Point3(-100, 72, 390);
        camera.setPosition(cam_pos);
        camera.setUp(new Communicator.Point3(0.0, 1, 0));
        camera.setWidth(1197.2799955801056);
        camera.setHeight(1197.2799955801056);
        viewer.getView().setCamera(camera, 0);
        viewer.getSelectionManager().setHighlightLineElementSelection(false);
        viewer.getSelectionManager().setHighlightFaceElementSelection(false);
        viewer.getSelectionManager().setSelectParentIfSelected(false);
        viewer.getView().setAmbientOcclusionEnabled(true);
        viewer.getView().setAmbientOcclusionRadius(0.02);
        viewer.setClientTimeout(60, 60);
      },
      modelStructureReady: function () {
        initDemo();
        enableControls();
      },
    });

    window.onresize = function () {
      viewer.resizeCanvas();
    };
}
