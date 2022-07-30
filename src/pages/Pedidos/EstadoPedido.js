import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import Loader from '../../components/Loader';
import { Endpoint, PublicHeaders } from "../../config";
import logo from "../../assets/images/logo.png";

export default class EstadoPedido extends Component {

    constructor(props) {
        super(props)

        this.state = {
            estados: []
        }
    }

    componentDidMount() {
        this.setState(() => { return { loading: true } });
        fetch(Endpoint(`/pedidos/${this.props.match.params.pedidoId}/changelog`), {
            method: 'GET',
            headers: PublicHeaders()
        }).then(response => {
            return response.json();
        }).then(response => {
            if (response.error) {
                throw Error(response.error)
            }
            return response;
        }).then(estados => {
            this.setState(() => { return { estados, loading: false } });
        }).catch(err => {
            console.error(err)
        });

    }

    render() {
        return (
            <Container>
                <Row>
                    <Col className="bg-primary p-3">
                        <img src={logo} alt="logo" />
                    </Col>
                </Row>

                <Row>
                    <Col lg="12" className="stretched_card">
                        <Card>
                            <CardBody>
                                <h4 className="card_title">Estado de pedido {this.props.match.params.pedidoId}</h4>

                                {
                                    this.state.loading && (
                                        <Loader />
                                    )
                                }

                                {
                                    !this.state.loading && this.state.estados.length === 0 && (
                                        <p className="text-center">
                                            No se encontró información del pedido
                                        </p>
                                    )
                                }
                                <div className="recent-activity">
                                    {
                                        this.state.estados.map((estado, index) => {
                                            const bg = estado.estadoId === 3 ? 'bg_success' : estado.estadoId === 4 ? 'bg_warning' : estado.estadoId === 5 ? 'bg_info' : estado.estadoId === 6 ? 'bg_info' : estado.estadoId === 7 ? 'bg_success' : estado.estadoId === 8 ? 'bg_danger' : 'bg_primary';
                                            const icon = estado.estadoId === 3 ? 'ft-clipboard' : estado.estadoId === 4 ? 'ft-heart' : estado.estadoId === 5 ? 'ft-map' : estado.estadoId === 6 ? 'ft-gift' : estado.estadoId === 7 ? 'ft-check' : estado.estadoId === 8 ? 'ft-x' : 'ft-message-square';
                                            return (
                                                <div key={index} className="timeline-task">
                                                    <div className={`icon ${bg}`}>
                                                        <i className={`feather ${icon}`} />
                                                    </div>
                                                    <div className="timeline_title">
                                                        <h4>{estado.estado.nombre}</h4>
                                                        <span className="time"><i className="ti-time"></i>{estado.fecha}</span>
                                                    </div>
                                                    {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse distinctio itaque at.
                                                    </p> */}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

