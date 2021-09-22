import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import { initialize3dViewer } from '@pdftron/webviewer-3d';
import './App.css';

const App = () => {
  const viewer = useRef(null);
  const [ internetExplorerCheck, setInternetExplorerCheck ] = useState(false);

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    if (window.document.documentMode) {
      setInternetExplorerCheck(true);
      return;
    }

    WebViewer(
      {
        path: '/webviewer/lib',
        enableMeasurement: true,
      },
      viewer.current,
    ).then(async instance => {
      instance.setTheme('dark');

      const license = `---- Insert commercial license key here after purchase ----`;
      // Extends WebViewer to allow loading 3D files (.glb, .gltf)
      const {
        loadModel,
      } =
      await initialize3dViewer(
        instance,
        { license },
      );

      // Shoe
      // loadModel("../../../assets/demo/inescop-shoe-293_U3D_RHC.pdf.u3d.glb");

      // Rib cage
      // loadModel("../../../assets/demo/IRCAD_EITS_Liver05-9.prc.glb");

      // Weird shape
      // loadModel("../../../assets/demo/c60_isosurf_3d_pdf-9.prc.glb");

      // Car part
      // loadModel("../../../assets/demo/car_v76_suspension_part_details_U3D_RHC.pdf.u3d.glb");

      // metal circle part
      // loadModel("../../../assets/demo/DominicNotman_4inChuck_U3D_RHC.pdf.u3d.glb");

      // Engine - really slow
      // loadModel("../../../assets/demo/Engine Issue 1-0 STEP AP214_AledJTaylor_U3D_RHC.pdf.u3d.glb");

      // Load a model at a specific url. Can be a local or public link
      // If local it needs to be relative to lib/ui/index.html.
      // Or at the root. (eg '/scene.gltf');
      loadModel("../../../assets/car2/scene.gltf");
      // loadModel("../../../assets/demo/T2P_dwg_TurboCAD-House_eU3D_RHC.pdf.u3d.glb");
      // loadModel("../../../assets/demo/DominicNotman_4inChuck_U3D_RHC.pdf.u3d.glb");
      // loadModel("../../../assets/demo/laurana50k_eU3D_RHC.pdf.u3d.glb");
      // loadModel("../../../assets/demo/more-pdf-fea-bracket-stress-PRCstream.prc.glb");
      // loadModel("../../../assets/demo/IRCAD_EITS_Liver05-9.prc.glb");
      // loadModel("../../../assets/the_mill/scene.gltf");
      // loadModel("../../../assets/house/scene.gltf");
      // loadModel("../../../assets/autumn_forest_wooden_house/scene.gltf");
      // loadModel("../../../assets/the_lighthouse/scene.gltf");
      // loadModel("../../../assets/forge/scene.gltf");
      // loadModel("../../../assets/city/scene.gltf");
      // loadModel("../../../assets/general_store/scene.gltf");
      // loadModel("../../../assets/medieval_building/scene.gltf");
      // loadModel("../../../assets/low_poly_building/scene.gltf");
    });
  }, []);

  if (internetExplorerCheck) {
    return (
      <div>
        WebViewer 3D does not support Internet Explorer.
      </div>
    );
  }

  return (
    <div className="App">
      <div className="webviewer" ref={viewer}/>
    </div>
  );
};

export default App;
