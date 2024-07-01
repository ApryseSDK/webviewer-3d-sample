# WebViewer 3D

WebViewer 3D allows you to view, annotate and collaborate on 3D models.

- Traverse 3D model object tree
- Toggle visibility of objects
- Use the same annotation capabilities as you do on PDFs, MS Office and videos
- Annotation hotspots to quickly navigate you to the annotated view
- Measure in 3D space by snapping to vertices
- View render, wireframe or vertex normals

This sample uses the [3D addon](https://www.npmjs.com/package/@pdftron/webviewer-3d) for WebViewer. It allows the loading of 3D models in .gltf or .glb formats.

<img src="https://pdftron.s3.amazonaws.com/custom/websitefiles/wv-3d.png" width="730">

## Demo

You can explore all of the functionality in our [showcase](https://webviewer-3d.web.app/).

## Initial setup

Before you begin, make sure your development environment includes [Node.js and npm](https://www.npmjs.com/get-npm).

In order to evaluate the Apryse WebViewer, you need to obtain a trial key. More information can be found here:
https://docs.apryse.com/documentation/web/get-started/trial-key/

In order to set the license key, you will need to set the string in the WebViewer sample. One such way is by passing it into the constructor of the WebViewer: 
https://docs.apryse.com/documentation/web/faq/add-license/#passing-into-constructor

Follow the steps below to set the license key in this sample:
 - Locate the App.js file at webviewer-3d-sample\src\App.js
 - Replace "---- Insert commercial license key here after purchase ----" with your license
 - Save the file


## Install

```
git clone https://github.com/PDFTron/webviewer-3d-sample.git
cd webviewer-3d-sample
npm install
```

## Run

```
npm start
```

## WebViewer APIs

See @pdftron/webviewer [API documentation](https://www.pdftron.com/documentation/web/guides/ui/apis).

## Contributing

See [contributing](./CONTRIBUTING.md).

## License

See [license](./LICENSE).
