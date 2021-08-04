import React from 'react';
import Viewer from './components/viewer/Viewer';
import Navigation from './components/navigation/Navigation';
import './App.css';

const App = () => {

  const [file, setFile] = React.useState(null);

  const handleFileChange = (model) => {
    setFile(model);
  }

  return (
    <div className="App">
      <Navigation handleOpenFile={handleFileChange}/>
      <Viewer model={file}/>
    </div>
  );
};

export default App;
