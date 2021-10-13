import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import { initialize3dViewer } from '@pdftron/webviewer-3d';
import './Viewer.css';
import '../../utils/WVSApiWrapper';

const Viewer = ({ model, url, setURL, setErrorMessage }) => {
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

  useEffect(() => { 
    if (viewer3d && url) {
      const serverUrl = 'http://pdf3d-lb-806273296.us-west-1.elb.amazonaws.com';
      var request = new XMLHttpRequest();
      let path = serverUrl + '/blackbox/Get3DPDF?uri=' + url;
      // path = path + '&ext=obj'
      // console.log(serverUrl + '/blackbox/Get3DPDF?uri=' + 'https://pdftron.s3.amazonaws.com/custom/test/kristian/airboat.obj');
      request.open("GET", path, true);
      // request.setRequestHeader('Content-Type', 'application/json');
      request.withCredentials = true;

      const promise = new Promise(function(resolve, reject) {
        request.onreadystatechange = function() {
          if (request.readyState === 4) {
            try {
              if (request.status === 200) {
                var type = request.getResponseHeader("Content-Type");
                if (type === "application/pdf") {
                  resolve([request.responseText, type]);
                } else if (type === "application/json") {
                  const data = JSON.parse(request.responseText);
                  for (var i = 0; i < data.length; i++) {
                    if(data[i].uri){
                      resolve([serverUrl + data[i].uri.slice(2), type]);
                    }
                  }
                }
              } else {
                reject('Unable to download PDF data: ' + request.status);
              }
            } catch (e) {
              reject('Unable to load PDF data: ' + e);
            }
          }
        };
        request.send();
      });

      promise.then(async result => {
        console.log(result);

        const response = await fetch(result[0]);
        const blob = await response.blob();
        // console.log('-----', blob.name);
        const url2 = URL.createObjectURL(blob);

        viewer3d.loadModel(url2, {
          fileName: 'airboat.gltf',
        });
        setErrorMessage(null);
        setURL(null);
      }).catch(reason => {
        setErrorMessage(reason);
        setURL(null);
      });

    }
  }, [viewer3d, url]);


  if (internetExplorerCheck) {
    return <div>WebViewer 3D does not support Internet Explorer.</div>;
  }

  return <div className="webviewer" ref={viewer} />;
};

export default Viewer;
