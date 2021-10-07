import React, { useState } from 'react';
import {
  Heading,
  InputGroup,
  InputLeftAddon,
  Input,
  Text,
  FormLabel,
  FormControl,
  Button as ChakraButton,
  Spinner,
  Link,
} from '@chakra-ui/react';
import './Navigation.css';

import { packGlbFromDataTransfer } from '@pdftron/webviewer-3d';

import "antd/dist/antd.css";
import { Upload, message, Button } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;


const Navigation = ({
  handleOpenFile,
  handleURL,
  fetchError,
}) => {
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(2000);
  const [modelURL, setModelURL] = useState('');
  const [error, setError] = useState(false);

  const draggerProps = {
    name: 'dropFolder',
    openFileDialogOnClick: false,
    showUploadList: false,
    multiple: true,
    customRequest({ file, onSuccess }){
      onSuccess("ok");
    },
    async onDrop(e) {
      console.log('Dropped files', e.dataTransfer.items);
      e.stopPropagation();
      e.preventDefault();
      console.log(e.dataTransfer.items[0]);
      try {
        const file = await packGlbFromDataTransfer(e.dataTransfer.items); 
        handleOpenFile(file);
      } catch (error) {
        console.error(error);
        message.error('Packing failed! Make sure you uploaded (.glft) (.bin) and all textures!');
      }
    },
  };
  
  const uploadProps = {
    name: 'uploadFile',
    showUploadList: false,
    customRequest({ file, onSuccess }){
      handleOpenFile(file);
      onSuccess("ok");
    },
  };

  return (
    <div className="Nav">
      <Heading size="md">WebViewer 3D</Heading>
      <Text py={5}>
        In this demo, you are able to open your own 3D models in GLB/GLTF
        format.
      </Text>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Click to upload a .gltf or .glb file</Button>
      </Upload>
      <div className="heading-container">
        <Heading size="sm">Or</Heading>
      </div>
      <Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Drop a directory with the .glft .bin and all textures here</p>
        <p className="ant-upload-hint">
          Packaging will fail if there are missing files
        </p>
      </Dragger> 
      <div className="heading-container">
        <Heading size="sm">Or</Heading> 
      </div>
      <FormControl id="height">
        <FormLabel>Load a URL</FormLabel>
        <Input
          size="md"
          onChange={(e) => {
            setModelURL(e.target.value);
          }}
        />
        <ChakraButton
          my={3}
          onClick={() => {
            if (modelURL !== null) {
              handleURL(modelURL);
            }
          }}
        >
          Load the model URL
        </ChakraButton>
      </FormControl>       
    </div>
  );
};

export default Navigation;
