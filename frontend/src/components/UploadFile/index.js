import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { uploadFile } from '../../store/reducer/file.reducer';



export default function UploadFile() {
    const dispatch = useDispatch();
    const [fileSelected, setFileSelected] = useState();
    const [progress, setProgress] = useState(0);
    const { loading, error } = useSelector(state => state.fileReducer);

    const onUploadProgress = (progressEvent) => {
        if (progressEvent.total) {
            setProgress((progressEvent.loaded / progressEvent.total * 100).toFixed(0));
        } else {
            setProgress(progressEvent.loaded);
        }
    }

    const onUploadFile = (event) => {
        setFileSelected(event.target.files[0]);
        console.log(event.target.files);
    }

    const handleUploadFile = async (event) => {
        setFileSelected(null);
        dispatch(uploadFile({ fileSelected, onUploadProgress }));
    }



    return (
        <div className="upload-file">
            
            <Container style={{textAlign: "center"}}>
            <h2>Upload</h2>
                <Row className="justify-content-md-center">
                    <Col lg="4">
                        <Form>
                            <Form.Group controlId="formFile">
                                <Form.Control type="file" onChange={onUploadFile} />
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col>
                        <Button variant="primary" disabled={!fileSelected} onClick={handleUploadFile}>Upload</Button>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col style={{ margin: "30px" }}>
                        {loading &&
                            <>
                                <ProgressBar now={progress} label={`${progress}%`} />
                                <div>Loading.....</div>
                            </>
                        }
                        {error && <div>UPLOAD ERROR</div>}
                    </Col>
                </Row>
            </Container>

        </div>
    )
}
