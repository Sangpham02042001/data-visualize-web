import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { getFileData, setFileData } from '../../store/reducer/file.reducer';
import TableData from '../TableData';



export default function UploadFile() {
    const dispatch = useDispatch();
    const fileData = useSelector(state => state.fileReducer.fileData);
    const [fileSelected, setFileSelected] = useState();


    const onUploadFile = (event) => {
        setFileSelected(event.target.files[0]);
        console.log(event.target.files);
    }

    const handleUploadFile = async (event) => {
        console.log(fileSelected);
        dispatch(getFileData({ fileSelected }));
    }

    const updateData = (rowIndex, columnId, value) => {
        setFileData({ rowIndex, columnId, value })
    }

    return (
        <div className="upload-file">
            <h2>Upload</h2>
            <Container>
                <Row className="justify-content-md-center">
                    <Col lg="4">
                        <Form>
                            <Form.Group controlId="formFile">
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
                <Row></Row>
                <Row className="justify-content-md-center">
                    {fileData.length > 0 &&
                        <>

                            <TableData fileData={fileData}
                                updateMyData={updateData}
                            />
                        </>
                    }
                </Row>
            </Container>

        </div>
    )
}
