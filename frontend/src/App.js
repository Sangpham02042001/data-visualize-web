import React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import UploadFile from './components/UploadFile';
import { useSelector } from 'react-redux';
import TableData from './components/TableData';

function App() {
  const { fileCached, fileLength, loading } = useSelector(state => state.fileReducer);
  return (
    <Container className="App">
      <UploadFile />
      {!loading && (fileCached && <TableData fileCached={fileCached} fileLength={fileLength} />)}
    </Container>
  );
}

export default App;
