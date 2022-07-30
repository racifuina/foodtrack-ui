import React, { Component, Fragment } from 'react'
import { Alert } from 'reactstrap';
import FormView from '../../components/FormView';
import FacturaView from '../../components/FacturaView';
import Loader from '../../components/Loader';
import { Endpoint, PrivateHeaders } from "../../config";

export default class Factura extends Component {

    constructor(props) {
        super(props)

        this.state = {
            factura: {
                facturaId: '',
                pedidoId: '',
                nombreReceptor: '',
                nit: '',
                serie: '',
                uid: '',
                fechaEmision: '',
                detalles: []
            }
        }
        this.getFactura = this.getFactura.bind(this)
    }

    componentDidMount() {
        this.getFactura()
    }

    getFactura() {
        this.setState(() => ({ loading: true }));
        if (this.props.match.params.facturaId) {
            fetch(Endpoint(`/facturas/${this.props.match.params.facturaId}`), {
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
            }).then(factura => {
                this.setState(() => ({ factura, loading: false }));
            }).catch(err => {
                const errorMessage = err.message.includes('fetch') ? 'Revise su conexión a internet' : err.message;
                this.setState(() => ({ loading: false, error: true, errorMessage }));
            });
        } else {
            this.setState(() => ({ loading: false }));
        }
    }

    render() {
        return (
            <FormView
                title={`Factura # ${this.props.match.params.facturaId}`}
            >
                <Fragment>
                    {
                        this.state.loading ?
                            <Loader /> :
                            this.state.error ?
                                <Alert color="danger">
                                    <span>{this.state.errorMessage}</span>
                                </Alert>
                                :
                                <FacturaView factura={this.state.factura} />
                    }
                </Fragment>

            </FormView >
        )
    }
}
