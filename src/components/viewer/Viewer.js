import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import { initialize3dViewer } from '@pdftron/webviewer-3d';
import './Viewer.css';

const Viewer = ({ model }) => {
  const viewer = useRef(null);
  const [internetExplorerCheck, setInternetExplorerCheck] = useState(false);
  const [viewer3d, setViewer3d] = useState(null);

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
      viewer.current
    ).then(async (instance) => {
      instance.setTheme('dark');

      const license = `---- Insert commercial license key here after purchase ----`;
      // Extends WebViewer to allow loading 3D files (.glb, .gltf)
      const viewerInitialized = await initialize3dViewer(instance, { license });
      setViewer3d(viewerInitialized);

      // Load a model at a specific url. Can be a local or public link
      // If local it needs to be relative to lib/ui/index.html.
      // Or at the root. (eg '/scene.gltf');
      viewerInitialized.loadModel('../../../assets/car2/scene.gltf');
    });
  }, []);

  useEffect(() => { 
    if (viewer3d && model) {
      const url = URL.createObjectURL(model);
      console.log(model.name);
      viewer3d.loadModel(url, {
        fileName: model.name,
      });
    }
  }, [viewer3d, model]);

  if (internetExplorerCheck) {
    return <div>WebViewer 3D does not support Internet Explorer.</div>;
  }

  return <div className="webviewer" ref={viewer} />;
};

export default Viewer;
