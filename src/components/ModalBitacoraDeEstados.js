import React, { useState, Fragment } from "react";
import { Button, Row, Col, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Loader from './Loader';
import { toast } from 'react-toastify';
import { Endpoint, PrivateHeaders } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { get } from "lodash";

export default function ModalBitacoraDeEstados({ url, method = 'GET', body = {}, children, className = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [estados, setListadoEstados] = useState([]);

    const onClickHandler = () => {
        setLoading(true);
        setIsOpen(true);
        setListadoEstados([]);
        const fetchParams = {
            method,
            headers: PrivateHeaders()
        }
        if (method === "POST") {
            fetchParams.body = body;
        }
        fetch(Endpoint(url), fetchParams).then(response => {
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
        }).then(estados => {
            setLoading(false);
            setListadoEstados(estados);
        }).catch(err => {
            setLoading(false);
            setListadoEstados([]);
            setIsOpen(false)
            toast.error(err.message, { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 15000 });
        });
    }

    return (
        <Fragment>
            {
                children ? children(onClickHandler) :
                    <Button
                        outline color="primary"
                        className={className}
                        onClick={onClickHandler}>
                        <FontAwesomeIcon
                            icon={faList}
                            color="primary"
                        /> Estados
                    </Button>
            }
            <Modal isOpen={isOpen} size="lg">
                <ModalHeader toggle={() => setIsOpen(false)}>Bitácora de Estados</ModalHeader>
                <ModalBody className="p-0 m-0">
                    {
                        loading ?
                            <Row className="p-5 text-center">
                                <Col>
                                    <Loader color="gray" />
                                </Col>
                            </Row> : estados.length === 0 ?
                                <Row className="p-5">
                                    <Col>
                                        <p className="text-center">No hay cambios de estado</p>
                                    </Col>
                                </Row> :
                                <ListGroup flush>
                                    <ListGroup className="todo-list-wrapper" flush>
                                        {
                                            estados.map((estado, index) => {
                                                return (
                                                    <ListGroupItem key={index}>
                                                        <div className="widget-content p-0">
                                                            <div className="widget-content-wrapper">
                                                                <div className="widget-heading text-primary text-lg" style={{fontSize: 18}}>
                                                                    <b>{estado.estado.nombre}</b>
                                                                </div>
                                                                <div className="">
                                                                    <i className="feather ft-clock mr-2" />{estado.fecha}
                                                                </div>
                                                                {
                                                                    estado.usuario && (
                                                                        <div className="">
                                                                            <i className="feather ft-user mr-2" /><b className="mr-2">{get(estado, 'usuario.empleado.nombre')}</b> 
                                                                            ({estado.usuario.email})
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    </ListGroupItem>
                                                )
                                            })
                                        }
                                    </ListGroup>
                                </ListGroup>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setIsOpen(false)}>Aceptar</Button>
                </ModalFooter>
            </Modal>
        </Fragment>
    )
}
