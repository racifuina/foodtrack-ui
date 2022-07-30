import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { Card, CardBody, Alert } from 'reactstrap';
import Loader from './Loader'
import { Endpoint, PrivateHeaders } from "../config";
import PedidoCard from './PedidoCard';


class ListarView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            error: false,
            showDefaultOptions: props.showDefaultOptions === undefined ? true : props.showDefaultOptions,
            enableFilters: false,
            errorMessage: '',
            data: []
        }
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        this.setState(() => ({ loading: true }));
        fetch(Endpoint(this.props.url), {
            method: 'GET',
            headers: PrivateHeaders()
        }).then(response => {
            if (response.status === 401) {
                this.props.history.push('/logout');
                throw Error("Debes iniciar sesión para poder accesar a este recurso");
            }
            return response.json();
        }).then(response => {
            if (response.error) {
                throw Error(response.error);
            }
            return response;
        }).then(data => {
            console.log(`data`, data)
            this.setState(() => ({ data, loading: false }));
        }).catch(err => {
            const errorMessage = err.message.includes('fetch') ? 'Revise su conexión a internet' : err.message;
            this.setState(() => ({ loading: false, error: true, errorMessage }));
        });
    }

    render() {
        return (
            <div className="pb-2" style={{ minHeight: 'calc(100vh - 155px)' }}>
                <div className="rt_subheader mb-2" >
                    <div className="rt_subheader_main">
                        <h3 className="rt_subheader_title mb-mob-2">{`${this.props.title} | ${this.state.data.length} Pedidos `} </h3>
                    </div>
                </div>
                <Card>
                    <CardBody className="hstack gap-3">
                        {
                            this.state.loading ?
                                <Loader /> :
                                this.state.error ?
                                    <Alert color="danger">
                                        <span>{this.state.errorMessage}</span>
                                    </Alert>
                                    :
                                    this.state.data.length === 0 ?
                                        <div>
                                            No hay pedidos
                                        </div> :
                                        <div className="card-deck bg-light py-3" style={{ overflowX: 'scroll' }}>
                                            {
                                                this.state.data.map((pedido, index) => (
                                                    <PedidoCard
                                                        key={index}
                                                        pedido={pedido}
                                                        updatePedido={estadoId => {
                                                            if (estadoId === 5 || estadoId === 7) {
                                                                this.setState(state => {
                                                                    const data = state.data.filter(p => p.pedidoId !== pedido.pedidoId);
                                                                    return {
                                                                        data
                                                                    }
                                                                })
                                                            } else {
                                                                this.setState(state => {
                                                                    const data = state.data;
                                                                    data[index].estadoId = estadoId;
                                                                    return {
                                                                        data
                                                                    }
                                                                })
                                                            }
                                                        }}
                                                    />
                                                ))
                                            }
                                        </div>

                        }
                    </CardBody>
                </Card>
            </div>

        )
    }
}

export default withRouter(ListarView);