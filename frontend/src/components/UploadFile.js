import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { getFileData } from '../store/reducer/file.reducer';
import TableData from './TableData';



export default function UploadFile() {
    const dispatch = useDispatch();
    const [fileSelected, setFileSelected] = useState();
    const fileData = useSelector(state => state.fileReducer.fileData);

    const onUploadFile = (event) => {
        setFileSelected(event.target.files[0]);
        console.log(event.target.files);
    }

    const handleUploadFile = async (event) => {
        console.log(fileSelected);
        dispatch(getFileData({fileSelected}));
    }


    return (
        <div className="upload-file">
            <h2>Upload</h2>
            <Container>
                <Row md="12">
                    <Col>
                        <Form>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Control type="file" onChange={onUploadFile} />
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="primary" disabled={!fileSelected} onClick={handleUploadFile}>Upload</Button>
                    </Col>
                </Row>
            </Container>
            {fileData.length > 0 && <TableData fileData={fileData}/>}
        </div>
    )
}
