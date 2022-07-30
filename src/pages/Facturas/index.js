import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { activateAuthLayout } from '../../store/actions';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ListarView from '../../components/ListarView';
import Factura from './Factura';

class Facturas extends Component {
    componentDidMount() {
        this.props.activateAuthLayout();
    }

    render() {
        return (
            <Switch>
                <Route path={`${this.props.match.url}/:facturaId`} component={Factura} />
                <Route path={`${this.props.match.url}/`} render={() => <ListarView
                    url="/facturas"
                    title="Facturas Electrónicas"
                    primaryKey="facturaId"
                    hideCreateButton={true}
                    showDefaultOptions={false}
                    columns={[
                        {
                            Header: 'Serie',
                            accessor: "serie"
                        }, {
                            Header: 'Número',
                            accessor: "facturaId"
                        }, {
                            Header: 'GUID',
                            accessor: "uid"
                        }, {
                            Header: 'NIT',
                            accessor: "nit"
                        }, {
                            Header: 'Nombre Receptor',
                            accessor: "nombreReceptor"
                        }, {
                            Header: 'Fecha Emisión',
                            accessor: "fechaEmision"
                        }, {
                            Cell: cellProps => (
                                <div style={{ width: '100%' }} className="text-center">
                                    <Link
                                        className="mr-2"
                                        to={`${this.props.match.url}/${cellProps.original.facturaId}`}
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
        )
    }
}

export default withRouter(connect(null, { activateAuthLayout })(Facturas));