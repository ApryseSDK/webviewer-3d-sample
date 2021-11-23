// (async function() {

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) == 0;
  };
}

function makeId(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function joinPaths() {
  let lhs, rhs;
  const arr = [];
  arr[arguments.length - 1] = null;
  let i = 0;
  if (arguments.length > 0) {
    rhs = arguments[i].endsWith('/') ? arguments[i].length - 1 : arguments[i].length;
    arr[i] = arguments[i].substring(0, rhs);
  }
  for (i = 1; i < arguments.length - 1; ++i) {
    lhs = arguments[i].startsWith('/') ? 1 : 0;
    rhs = arguments[i].endsWith('/') ? arguments[i].length - 1 : arguments[i].length;
    arr[i] = arguments[i].substring(lhs, rhs);
  }
  if (arguments.length > 1) {
    lhs = arguments[i].startsWith('/') ? 1 : 0;
    arr[i] = arguments[i].substring(lhs, arguments[i].length);
  }
  return arr.join('/');
};

function getExt(fname) {
  var dotLoc = fname.lastIndexOf('.');
  if(dotLoc < 0){
    return '';
  }
  return fname.substr(dotLoc+1);
};

function uploadFileData(server, onCompletion, options) {
  var uri = joinPaths(server.serverUrl + 'AuxUpload?type=upload&bcid=' + options.bcid);
  if (options.extension) {
    uri += '&ext=' + options.extension;
  }

  const data = new FormData();
  data.append('file', options.file, options.file.name);

  const request = new XMLHttpRequest();
  request.open('POST', uri);
  request.withCredentials = true;
  return new Promise(function (resolve, reject) {
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        try {
          if (request.status === 200) {
            const resp = JSON.parse(request.responseText);
            if(resp.uri){
              resolve(onCompletion(server, resp.uri, options));
            } else {
              reject('Upload failed: ' + request.status);
            }
          }
        } catch (e) {
          reject('Unable to load PDF data: ' + e);
        }
      }
    };

    request.onprogress = function(event) {
      options.onProgress({ type: 'upload', loaded: event.loaded, total: event.total});
    };

    request.send(data);
  });
};

function fetchThumb(server, docUrl, options) {
  const request = new XMLHttpRequest();
  let url = joinPaths(server.serverUrl, 'GetThumb?uri=' + encodeURIComponent(docUrl) + '&bcid=' + options.bcid);

  if(options.extension) {
    url += '&ext=' + options.extension;
  }

  if(options.cacheKey) {
    url += '&cacheKey=' + options.cacheKey;
  }

  if (options.size) {
    url += "&size=" + options.size;
  }

  if (options.page) {
    url += "&page=" + options.page;
  }

  request.open('GET', url);
  request.withCredentials = true;

  return new Promise(function(resolve, reject) {
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        try {
          if (request.status === 200) {
            const data = JSON.parse(request.responseText);
            for (var i = 0; i < data.length; i++) {
              if(data[i].uri){
                resolve(server.serverUrl + "../" + data[i].uri + "?bcid=" + options.bcid);
              }
            }
          } else {
            reject('Unable to download thumb data: ' + request.status);
          }
        } catch (e) {
          reject('Unable to load thumb data: ' + e);
        }
      }
    };

    request.onprogress = function(evt) {
      options.onProgress({ type: 'fetch', loaded: evt.loaded, total: evt.total});
    };

    request.send();
  });
};

function fetchPdf(server, docUrl, options) {
  const request = new XMLHttpRequest();
  let url = joinPaths(server.serverUrl, 'Get3DPDF?uri=' + encodeURIComponent(docUrl) + '&bcid=' + options.bcid);
  if(options.pdfa) {
    url += '&pdfa=' + options.pdfa;
  }

  if (options.linearize == true) {
    url += '&linearize=true';
  }


  if (options.format) {
    url += '&fmt=' + options.format;
  }

  if(options.extension) {
    url += '&ext=' + options.extension;
  } 

  if(options.cacheKey) {
    url += '&cacheKey=' + options.cacheKey;
  }

  request.open('POST', url);
  if (options.customHeaders) {
    request.setRequestHeader('PDFTron-Custom', JSON.stringify(options.customHeaders));
  }

  request.withCredentials = true;

  return new Promise(function(resolve, reject) {
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
                  resolve([server.serverUrl + data[i].uri + "?bcid=" + options.bcid, type]);
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

    request.onprogress = function(evt) {
      options.onProgress({ type: 'fetch', loaded: evt.loaded, total: evt.total});
    };

    if(options.xfdf) {
      request.setRequestHeader('Accept-Charset', 'utf8');
      var formData = new FormData();
      formData.append('xfdf', options.xfdf);
      request.send(formData);
    } else {
      request.send();
    }
  });
};

function nullFunc(){};

/**
   Constructor for GetPDF api.

   Takes an object containing the options:
   serverUrl: the WebViewer Server to contact
   pdfa: the PDFA format desired
*/
const WebViewerServer = function(options) {
  // if (!options.serverUrl) {
  //   reject("No server address specified.");
  // }

  const server = {};
  server.serverUrl = joinPaths(options.serverUrl, '/blackbox/');

  server.getPDF = function (options) {
    return new Promise(function(resolve, reject) {
      if (!options) {
        reject("options must be defined.");
      }

      // stickiness key
      options.bcid = makeId(8);
      options.onProgress = options.onProgress ? options.onProgress : nullFunc;

      if (options.file) {
        if (!options.extension) {
          options.extension = getExt(options.file.name);
        }

        resolve(uploadFileData(server, fetchPdf, options));
        return;
      } else if (options.uri) {
        resolve(fetchPdf(server, options.uri, options));
        return;
      }

      reject("No url or file found in options.");
      return;
    });
  };

  server.getThumb = function (options) {
    return new Promise(function(resolve, reject) {
      if (!options) {
        reject("options must be defined.");
      }

      options.bcid = makeId(8);
      options.onProgress = options.onProgress ? options.onProgress : nullFunc;

      if (options.file) {
        if (!options.extension) {
          options.extension = getExt(options.file.name);
        }

        resolve(uploadFileData(server, fetchThumb, options));
        return;
      } else if (options.uri) {
        resolve(fetchThumb(server, options.uri, options));
        return;
      }

      reject("No url or file found in options.");
      return;
    });

  };

  return server;
};


// const server = WebViewerServer({
//   serverUrl: 'http://pdf3d-lb-806273296.us-west-1.elb.amazonaws.com/',
// })


//   server.getPDF({
//     uri: 'https://pdftron.s3.amazonaws.com/custom/test/kristian/airboat.glb',
//   });
// })();

// const serverUrl = 'http://pdf3d-lb-806273296.us-west-1.elb.amazonaws.com';
// var request = new XMLHttpRequest();
// const path = joinPaths(serverUrl, '/blackbox/Get3DPDF?uri=' + encodeURIComponent('https://pdftron.s3.amazonaws.com/custom/test/kristian/airboat.obj'));
// console.log(path);
// // console.log(serverUrl + '/blackbox/Get3DPDF?uri=' + 'https://pdftron.s3.amazonaws.com/custom/test/kristian/airboat.obj');
// request.open("POST", path, true);
// request.setRequestHeader('Content-Type', 'application/json');
// request.withCredentials = true;

// const promise = new Promise(function(resolve, reject) {
//   request.onreadystatechange = function() {
//     if (request.readyState === 4) {
//       try {
//         if (request.status === 200) {
//           var type = request.getResponseHeader("Content-Type");
//           if (type === "application/pdf") {
//             resolve([request.responseText, type]);
//           } else if (type === "application/json") {
//             const data = JSON.parse(request.responseText);
//             for (var i = 0; i < data.length; i++) {
//               if(data[i].uri){
//                 resolve([serverUrl + data[i].uri, type]);
//               }
//             }
//           }
//         } else {
//           reject('Unable to download PDF data: ' + request.status);
//         }
//       } catch (e) {
//         reject('Unable to load PDF data: ' + e);
//       }
//     }
//   };
//   request.send();
// });

// promise.then(result => {
//   console.log(result);
// });



// var uri = joinPaths(serverUrl + 'AuxUpload?type=upload');
// const data = new FormData();
// data.append('file', file, file.name);

// const request = new XMLHttpRequest();
// request.open('POST', uri);
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

//   request.onprogress = function(event) {
//     options.onProgress({ type: 'upload', loaded: event.loaded, total: event.total});
//   };

//   request.send(data);
// });

// promise.then(result => {
//   console.log(result);
// });