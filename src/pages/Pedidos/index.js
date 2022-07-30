import React, { Component } from 'react'
import { Switch, Route , Link} from 'react-router-dom';
import { activateAuthLayout } from '../../store/actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ListarView from '../../components/ListarView'
import Pedido from './Pedido'
const primaryKey = 'pedidoId';

class Pedidos extends Component {

    componentDidMount() {
        this.props.activateAuthLayout();
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path={`${this.props.match.url}/crear`} component={Pedido} />
                    <Route path={`${this.props.match.url}/:${primaryKey}`} component={Pedido} />
                    <Route path={`${this.props.match.url}/`} render={() => <ListarView
                        url="/pedidos"
                        title="Pedidos"
                        newItemButtonText="Nuevo Pedido"
                        primaryKey={primaryKey}
                        showDefaultOptions={false}
                        columns={[
                            {
                                Header: '# Pedido', accessor: primaryKey, maxWidth: 100, id: 'numeroPedido'
                            }, {
                                Header: 'Cliente', accessor: "cliente.nombre", id: "1"
                            }, {
                                Header: '# Teléfono', accessor: "numeroTelefono", id: "n"
                            }, {
                                Header: 'Direccion de entrega', accessor: "direccion", id: "2"
                            }, {
                                Header: 'Fecha Creación', accessor: "fechaCreacion", id: "3"
                            }, {
                                Header: 'Estado', accessor: "estado.nombre", id: "4"
                            }, {
                                Cell: cellProps => (
                                    <div style={{ width: '100%' }} className="text-center">
                                        <Link
                                            className="mr-2"
                                            to={`${this.props.match.url}/${cellProps.original[primaryKey]}`}
                                        >
                                            <i className="feather ft-eye mr-1" />
                                            <span>Detalles</span>
                                        </Link>
                                    </div>
                                )
                            }
                        ]}
                    />} />
                </Switch>
            </div>
        )
    }
}

export default withRouter(connect(null, { activateAuthLayout })(Pedidos));