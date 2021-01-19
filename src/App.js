import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import { initializeAudioViewer } from '@pdftron/webviewer-audio';
import './App.css';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const DOCUMENT_ID = 'audio';

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
        disabledElements: [
          'searchButton',
          'pageNavOverlay',
          'viewControlsButton',
          'panToolButton',
          'underlineToolGroupButton',
          'strikeoutToolGroupButton',
          'highlightToolGroupButton',
          'squigglyToolGroupButton',
          'signatureToolButton',
          'leftPanel',
          'leftPanelButton',
          'toolbarGroup-Edit',
          'themeChangeButton',
          'fullscreenButton',
          'menuButton',
          'annotationCommentButton',
          'toggleNotesButton',
          'annotationNoteConnectorLine',
          'annotationPopup',
          'redoButton',
          'undoButton',
          'eraserToolButton',
          'toolbarGroup-Shapes',
          'toolbarGroup-Insert',
          'freeHandToolGroupButton',
          'shapeToolGroupButton',
          'freeTextToolGroupButton',
          'stickyToolGroupButton',
          'dropdown-item-position',
          'dropdown-item-time',
          'dropdown-item-status',
          'dropdown-item-author',
          'dropdown-item-type',
          'zoomOverlayButton',
        ],
      },
      viewer.current,
    ).then(async instance => {
      const { setHeaderItems, annotManager } = instance;

      instance.setTheme('dark');
      // safari check due to a bug in webviewer
      !isSafari && instance.openElements('notesPanel');

      const license = `---- Insert commercial license key here after purchase ----`;
      // Extends WebViewer to allow loading media elements (.mp3, .mp4, ogg, webm, etc.)
      const {
        loadAudio,
      } = await initializeAudioViewer(
        instance,
        { license },
      );

      // Load a media element at a specific url. Can be a local or public link
      // If local it needs to be relative to lib/ui/index.html.
      // Or at the root. (eg '/audio.mp3')
      const audioUrl = '/audio.mp3';
      loadAudio(audioUrl);

      const { docViewer } = instance;

      // Add save annotations button
      setHeaderItems(header => {
        header.push({
          type: 'actionButton',
          img: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
          title: 'Save Annotations',
          onClick: async () => {
            // Save annotations when button is clicked
            // widgets and links will remain in the document without changing so it isn't necessary to export them

            // Make a POST request with XFDF string
            const saveXfdfString = (documentId, xfdfString) => {
              return new Promise(resolve => {
                fetch(`/server/annotationHandler.js?documentId=${documentId}`, {
                  method: 'POST',
                  body: xfdfString,
                }).then(response => {
                  if (response.status === 200) {
                    resolve();
                  }
                });
              });
            };

            const annotations = docViewer.getAnnotationManager().getAnnotationsList();
            var xfdfString = await annotManager.exportAnnotations({ links: false, widgets: false, annotList: annotations });
            await saveXfdfString(DOCUMENT_ID, xfdfString);
            alert('Annotations saved successfully.');
          }
        });
      });

      let once = false;
      // Load saved annotations
      docViewer.on('pageComplete', () => {
        if (once) {
          return;
        }
        once = true;
        // Make a GET request to get XFDF string
        // const loadXfdfString = documentId => {
        //   return new Promise(resolve => {
        //     fetch(`/server/annotationHandler.js?documentId=${documentId}`, {
        //       method: 'GET'
        //     }).then(response => {
        //       if (response.status === 200) {
        //         response.text()
        //           .then(xfdfString => {
        //             console.log(xfdfString);
        //             resolve(xfdfString);
        //           });
        //       } else if (response.status === 204) {
        //         console.warn(`Found no content in xfdf file /server/annotationHandler.js?documentId=${documentId}`);
        //         resolve('');
        //       } else {
        //         console.warn(`Something went wrong trying to load xfdf file /server/annotationHandler.js?documentId=${documentId}`);
        //         console.warn(`Response status ${response.status}`);
        //         resolve('');
        //       }
        //     });
        //   });
        // };

        // loadXfdfString(DOCUMENT_ID)
        //   .then(xfdfString => {
        setTimeout(() => {
          const xfdfString = `<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><annots><text page="0" rect="0,609,31,640" color="#ADB5BD" flags="print,nozoom,norotate" name="wavesurfer_4n5ikq5l768" title="Guest" subject="Note" date="D:20210118232225-08'00'" start-time="3.3887378842905305" end-time="7.127233380065879" audio-tool-type="AudioRedactTool" creationdate="D:20210118155358-08'00'" icon="Comment" statemodel="Review"><trn-custom-data bytes="{&quot;trn-mention&quot;:{&quot;contents&quot;:&quot;This a redaction. Select the region on the waveform and click on the redaction button to apply it.&quot;,&quot;ids&quot;:[]}}"/><contents>This a redaction. Select the region on the waveform and click on the redaction button to apply it.</contents></text><text page="0" rect="0,609,31,640" color="#FFCD45" flags="print,nozoom,norotate" name="wavesurfer_14ria836tg" title="Guest" subject="Note" date="D:20210118232252-08'00'" start-time="12.31996818656027" end-time="18.358776757746135" audio-tool-type="AudioCommentTool" creationdate="D:20210118232237-08'00'" icon="Comment" statemodel="Review"><trn-custom-data bytes="{&quot;trn-mention&quot;:{&quot;contents&quot;:&quot;This is a comment.&quot;,&quot;ids&quot;:[]}}"/><contents>This is a comment.</contents></text><text page="0" rect="0,609,31,640" color="#25D2D1" flags="print,nozoom,norotate" name="wavesurfer_2jrrhutfk6o" title="Guest" subject="Note" date="D:20210118232321-08'00'" start-time="21.465881582754626" end-time="23.921496686390373" audio-tool-type="AudioCommentTool2" creationdate="D:20210118232306-08'00'" icon="Comment" statemodel="Review"><trn-custom-data bytes="{&quot;trn-mention&quot;:{&quot;contents&quot;:&quot;Hello world!&quot;,&quot;ids&quot;:[]}}"/><contents>Hello world!</contents></text></annots></xfdf>`;
          const annotManager = docViewer.getAnnotationManager();
          return annotManager.importAnnotations(xfdfString);
        }, 1000);
        // });
      });
    });
  }, []);

  if (internetExplorerCheck) {
    return (
      <div>
        WebViewer Audio does not support Internet Explorer.
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
