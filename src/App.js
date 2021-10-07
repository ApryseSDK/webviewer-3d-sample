import React from 'react';
import Viewer from './components/viewer/Viewer';
import Navigation from './components/navigation/Navigation';
import './App.css';

const App = () => {

  const [file, setFile] = React.useState(null);
  const [url, setURL] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleFileChange = (model) => {
    // console.log('model', model);

    // const serverUrl = 'http://pdf3d-lb-806273296.us-west-1.elb.amazonaws.com';
    // const uri = serverUrl + '/blackbox/AuxUpload?type=upload&ext=gltf';
    // const data = new FormData();
    // data.append('file', model, model.name);

    // const request = new XMLHttpRequest();
    // request.open('POST', uri);
    // // request.setRequestHeader('Content-Type', 'application/json');
    // request.withCredentials = true;
    // const promise = new Promise(function (resolve, reject) {
    //   request.onreadystatechange = function() {
    //     if (request.readyState === 4) {
    //       try {
    //         if (request.status === 200) {
    //           const resp = JSON.parse(request.responseText);
    //           if(resp.uri){
    //             resolve(resp.uri);
    //           } else {
    //             reject('Upload failed: ' + request.status);
    //           }
    //         }
    //       } catch (e) {
    //         reject('Unable to load PDF data: ' + e);
    //       }
    //     }
    //   };
    //   request.send(data);
    // });

    // promise.then(result => {
    //   console.log(result);


    //   var request2 = new XMLHttpRequest();
    //   let path = serverUrl + '/blackbox/Get3DPDF?uri=' + result;
    //   // path = path.substring(0, path.length - 5);
    //   // path = path + '&ext=gltf';
    //   console.log(path);
    //   // console.log(serverUrl + '/blackbox/Get3DPDF?uri=' + 'https://pdftron.s3.amazonaws.com/custom/test/kristian/airboat.obj');
    //   request2.open("POST", path, true);
    //   request2.setRequestHeader('Content-Type', 'application/json');
    //   request2.withCredentials = true;
      
    //   const promise2 = new Promise(function(resolve, reject) {
    //     request2.onreadystatechange = function() {
    //       if (request2.readyState === 4) {
    //         try {
    //           if (request2.status === 200) {
    //             var type = request2.getResponseHeader("Content-Type");
    //             if (type === "application/pdf") {
    //               resolve([request2.responseText, type]);
    //             } else if (type === "application/json") {
    //               const data = JSON.parse(request2.responseText);
    //               for (var i = 0; i < data.length; i++) {
    //                 if(data[i].uri){
    //                   resolve([serverUrl + data[i].uri, type]);
    //                 }
    //               }
    //             }
    //           } else {
    //             reject('Unable to download PDF data: ' + request2.status);
    //           }
    //         } catch (e) {
    //           reject('Unable to load PDF data: ' + e);
    //         }
    //       }
    //     };
    //     request2.send();
    //   });
      
    //   promise2.then(result2 => {
    //     console.log(result2);
    //   });
      
    // });

    setFile(model);
  }

  // const handleURL = url => {
  //   setURL
  // }

  return (
    <div className="App">
      <Navigation 
        handleOpenFile={handleFileChange}
        handleURL={setURL}
        errorMessage={errorMessage}
      />
      <Viewer 
        model={file}
        url={url}
        setErrorMessage={setErrorMessage}
        setURL={setURL}
      />
    </div>
  );
};

export default App;
