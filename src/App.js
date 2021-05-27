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

      // Load a model at a specific url. Can be a local or public link
      // If local it needs to be relative to lib/ui/index.html.
      // Or at the root. (eg '/scene.gltf');
      loadModel("../../../assets/car2/scene.gltf");
      // loadModel("../../../assets/hydraulic-cylinder.gltf");
      // loadModel("../../../assets/airboat-vtk.glb");
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
