import React, { useState, useEffect, Fragment } from 'react';
import { Button,Container, Col, Input, Row, Modal, Card, CardHeader, CardBody } from 'reactstrap';
import { useFormikContext } from 'formik';
import Slider from "react-slick";
import Loader from './Loader'
import { Endpoint, PrivateFileHeaders, PrivateFileWithToken, DownloadPrivateFileWithToken } from "../config";

export default function FileField(props) {

    let currentSlider;
    const { setFieldValue } = useFormikContext();

    const [files, setFiles] = useState(props.value.split(",").filter(item => item !== ""));
    const [uploading, setUploading] = useState(false);
    const [showNewUpload, setShowNewUpload] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [gotDataFromProps, setGotDataFromProps] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    if (!gotDataFromProps && files.length === 0 && props.value.split(",").filter(item => item !== "").length > 0 && files.length !== props.value.split(",").filter(item => item !== "").length) {
        setFiles(props.value.split(",").filter(item => item !== ""))
        setGotDataFromProps(true);
    }

    useEffect(() => {
        if (files.length === 0) {
            setIsOpen(false);
        }

        setFieldValue(props.name, files.join(","));
    }, [files])

    const mostrarModalVistaPrevia = () => setIsOpen(true);

    const siguiente = () => {
        if (currentSlider) {
            currentSlider.slickNext();
        }
    };

    const anterior = () => {
        if (currentSlider) {
            currentSlider.slickPrev();
        }
    };

    const sliderSettings = {
        infinite: true,
        dots: false,
        draggable: false,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: false,
        initialSlide: 0,
        autoplay: false,
        adaptiveHeight: false,
        beforeChange: (oldIndex, newIndex) => {
            setCurrentSlideIndex(newIndex);
        }
    };

    const uploadFilesInput = () => {
        return uploading ?
            <Loader /> : (
                <Input
                    type="file"
                    multiple={props.multiple}
                    disabled={uploading || props.disabled}
                    className={props.className}
                    style={{paddingRight: -100}}
                    accept={props.allowedFileTypes.join(", ")}
                    onChange={event => {
                        setUploading(true);
                        props.onUploadStatusChanged && props.onUploadStatusChanged(true);
                        if (!event.target.files.length) {
                            setFiles(files);
                            setGotDataFromProps(true);
                        }

                        let archivos = [];
                        for (var i = 0; i < event.target.files.length; i++) {
                            archivos.push(event.target.files.item(i))
                        }

                        const fileUploads = archivos.map(file => {
                            const formData = new FormData();
                            formData.append('file', file);
                            return fetch(Endpoint(`/archivos`), {
                                method: 'POST',
                                body: formData,
                                headers: PrivateFileHeaders()
                            }).then(response => {
                                if (response.status === 401) {
                                    throw Error("Debes iniciar sesión para poder accesar a este recurso")
                                }
                                return response.json();
                            }).then(response => {
                                if (response.error) {
                                    throw Error(response.error);
                                }
                                return response;
                            });
                        });

                        Promise.all(fileUploads).then(responses => {
                            setFiles(files.concat(responses.map(response => response.urlFile)));
                            setShowNewUpload(false);
                            setGotDataFromProps(true);
                            setUploading(false);
                            props.onUploadStatusChanged && props.onUploadStatusChanged(false);
                        }).catch(err => {
                            console.error(err)
                            setFiles(files);
                            setGotDataFromProps(true);
                            setUploading(false);
                            setShowNewUpload(false);
                            props.onUploadStatusChanged && props.onUploadStatusChanged(false);
                            props.onUploadFailed && props.onUploadFailed(err.message);
                        })
                    }}
                />
            )
    }

    return files.length > 0 ?
        <Row form>
            <Col>
                <Button
                    color="primary"
                    outline
                    size="lg"
                    block
                    onClick={mostrarModalVistaPrevia}>
                    {files.length > 1 ? `Vista Previa ${files.length} archivos` : `Vista Previa`}
                </Button>
            </Col>
            <Fragment>
                <Modal isOpen={isOpen} size="xl">
                    <Card>
                        <CardHeader className="p-0 text-primary">
                            <Container fluid>
                                <Row>
                                    <Col className="mt-2">
                                        <span >{`Vista Previa (${currentSlideIndex + 1} / ${files.length})`}</span>
                                    </Col>
                                    <Col>
                                        <Button className="ml-3 float-right" color="danger" outline onClick={() => setIsOpen(false)}>
                                            <i className="lnr-cross" />
                                        </Button>
                                        {
                                            files.length > 1 &&
                                            <Button
                                                className="mx-2 float-right"
                                                color="primary"
                                                outline
                                                onClick={siguiente}
                                            >
                                                <i className="lnr-chevron-right" />
                                            </Button>
                                        }
                                        {
                                            files.length > 1 &&
                                            <Button
                                                className="mx-2 float-right"
                                                color="primary"
                                                outline
                                                onClick={anterior}
                                            >
                                                <i className="lnr-chevron-left" />
                                            </Button>
                                        }
                                        <Button
                                            className="mx-2"
                                            color="warning"
                                            outline
                                            onClick={() => setShowNewUpload(true)}>
                                            <i className="lnr-file-add" />
                                        </Button>
                                        {
                                            files.map((file, index) => {
                                                return index === currentSlideIndex && (
                                                    <Fragment key={index}>
                                                        <a
                                                            key={index}
                                                            href={DownloadPrivateFileWithToken(file)}
                                                            className="btn btn-outline-success mx-2 "
                                                        >
                                                            <i className="lnr-download" />
                                                        </a>
                                                        <Button
                                                            className="mx-2"
                                                            color="danger"
                                                            outline
                                                            onClick={() => {
                                                                setFiles(files.filter(currentFile => currentFile !== file))
                                                                setGotDataFromProps(true);
                                                            }}>
                                                            <i className="lnr-trash" />
                                                        </Button>
                                                    </Fragment>

                                                )
                                            })
                                        }
                                    </Col>
                                </Row>
                            </Container>
                        </CardHeader>
                        <CardBody
                            className="p-0"
                        >
                            {
                                showNewUpload === true ?
                                    <div
                                        className="mx-2 mb-2 p-2"
                                        style={{ height: 800 }}
                                    >
                                        <Row>
                                            <Col>
                                                <div

                                                >
                                                    {uploadFilesInput()}

                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="mt-5">
                                            <Col>
                                                <Button block
                                                    onClick={() => setShowNewUpload(false)}
                                                >Cancelar</Button>
                                            </Col>
                                        </Row>
                                    </div> :
                                    <Slider ref={slider => (currentSlider = slider)} {...sliderSettings}>
                                        {
                                            files.map((fileURL, index) => (
                                                <div key={index}>
                                                    <iframe
                                                        title="Archivo Adjunto"
                                                        width="100%"
                                                        height="800"
                                                        frameBorder="0"
                                                        src={PrivateFileWithToken(fileURL)}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </Slider>
                            }

                        </CardBody>
                    </Card>
                </Modal>
            </Fragment>
        </Row>
        :
        uploadFilesInput()

}