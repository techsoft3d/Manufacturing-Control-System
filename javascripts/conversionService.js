modelUIDs = [
        "4709d28e-db9e-4cdc-9ee8-18e0db5615c6" //moto
]

async function startViewer() {
        var viewer;
        let sessioninfo = await caasClient.getStreamingSession();
        await caasClient.enableStreamAccess(sessioninfo.sessionid, modelUIDs);
        
        viewer = new Communicator.WebViewer({
                containerId: "theCanvas",
                endpointUri: sessioninfo.endpointUri,
                model: "moto",
                enginePath: "https://cdn.jsdelivr.net/gh/techsoft3d/hoops-web-viewer",
                rendererType: 0
        });

        viewer.start();

        return viewer;

}

async function fetchVersionNumber() {
  let data = await caasClient.getHCVersion();
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
