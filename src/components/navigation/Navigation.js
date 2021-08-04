import React, { useState } from 'react';
import {
  Heading,
  InputGroup,
  InputLeftAddon,
  Input,
  Button,
  Text,
  FormLabel,
  FormControl,
  Spinner,
  Link,
} from '@chakra-ui/react';
import './Navigation.css';

const Navigation = ({
  handleOpenFile,
  fetchError,
}) => {
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(2000);
  const [error, setError] = useState(false);

  return (
    <div className="Nav">
      <Heading size="md">WebViewer 3D</Heading>
      <Text py={5}>
        In this demo, you are able to open your own 3D models in GLB/GLTF
        format, or convert{' '}
        <Link href="https://www.pdf3d.com/file-formats/" isExternal>
          other formats
        </Link>{' '}
        to GLB/GLTF and then open them.
      </Text>

      <input
        id="file-picker"
        type="file"
        accept=".glb,.gltf"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            handleOpenFile(file);
          }
        }}
      />

      {error && (
        <Text color="red">
          Please enter a valid URL, width and height and try again.
        </Text>
      )}
      {fetchError ? <Text color="red">{fetchError}</Text> : null}
    </div>
  );
};

export default Navigation;
