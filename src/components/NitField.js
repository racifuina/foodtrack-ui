import React, { useState, Fragment } from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Modal, ModalHeader, ModalBody, Row, Col, ModalFooter, Button } from 'reactstrap';
import { Field } from 'formik';
import Loader from './Loader';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { Endpoint, PrivateHeaders } from "../config";
import validarNit from '../helpers/validarNit';

export default function NitField({ disabled, name, autoComplete, className, value }) {
    const [loading, setLoading] = useState(false);
    const [infoFiscal, setInfoFiscal] = useState(null)
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Fragment>
            <Modal isOpen={isOpen} size="lg">
                <ModalHeader toggle={() => setIsOpen(false)}>{`Información Fiscal del Nit ${infoFiscal ? infoFiscal.NITReceptor : ""}`}</ModalHeader>
                <ModalBody className="p-0 m-0">
                    {
                        loading ?
                            <Row className="p-5">
                                <Col>
                                    <Loader />
                                </Col>
                            </Row> : !infoFiscal ?
                                <Row className="p-5">
                                    <Col>
                                        <p className="text-center">No se encontró información fiscal</p>
                                    </Col>
                                </Row> :
                                <div className="p-2 m-2">
                                    <Row className='mt-2'>
                                        <Col>
                                            <p>Nombre Receptor</p>
                                            <h3>{infoFiscal.NombreReceptor}</h3>
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row className='mt-2'>
                                        <Col className="border-right">
                                            <p>Dirección</p>
                                            <h3>{infoFiscal.Direccion}</h3>
                                        </Col>
                                        <Col className="border-right">
                                            <p>Departamento</p>
                                            <h3>{infoFiscal.Departamento}</h3>
                                        </Col>
                                        <Col>
                                            <p>Municipio</p>
                                            <h3>{infoFiscal.Municipio}</h3>
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row className='mt-2'>
                                        <Col className="border-right">
                                            <p>País</p>
                                            <h3>{infoFiscal.Pais}</h3>
                                        </Col>
                                        <Col>
                                            <p>Código Postal</p>
                                            <h3>{infoFiscal.CodigoPostal}</h3>
                                        </Col>
                                    </Row>
                                </div>


                    }
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setIsOpen(false)}>Aceptar</Button>
                </ModalFooter>
            </Modal>
            <InputGroup>
                <Field
                    type="text"
                    maxLength={20}
                    disabled={disabled}
                    name={name}
                    autoComplete={autoComplete}
                    className={className}
                    value={value}
                />
                <InputGroupAddon addonType="append" style={{ cursor: "pointer" }} onClick={() => {
                    if (!value) {
                        return;
                    }
                    if (!validarNit(value)) {
                        return toast.error(`No es un Nit valido`, { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 15000 });
                    }

                    setInfoFiscal(null);
                    setLoading(true);
                    fetch(Endpoint(`/clientes/validar-nit/${value}`), {
                        method: 'GET',
                        headers: PrivateHeaders()
                    }).then(response => {
                        if (response.status === 401) {
                            this.props.history.push('/auth/logout');
                            throw Error("Debes iniciar sesión para poder accesar a este recurso")
                        }
                        return response.json();
                    }).then(response => {
                        if (response.error) {
                            throw Error(response.error)
                        }
                        return response;
                    }).then(infoFiscal => {
                        setInfoFiscal(infoFiscal.Receptor);
                        setLoading(false);
                        setIsOpen(true)
                    }).catch(err => {
                        console.error(err)
                        setLoading(false);
                        toast.error(err.message, { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 15000 });
                    });
                }}>
                    <InputGroupText>
                        {
                            loading ?
                                <Loader />
                                :
                                <FontAwesomeIcon
                                    icon={faQuestionCircle}
                                    color="primary"
                                />
                        }
                    </InputGroupText>
                </InputGroupAddon>
            </InputGroup>
        </Fragment>
    )

}