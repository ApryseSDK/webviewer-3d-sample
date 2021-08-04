import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';

const component = (
  <ChakraProvider>
    <App />
  </ChakraProvider>
);

ReactDOM.render(component, document.getElementById('root'));
