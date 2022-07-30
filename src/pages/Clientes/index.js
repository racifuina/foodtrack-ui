import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom';
import { activateAuthLayout } from '../../store/actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ListarView from '../../components/ListarView'
import Cliente from './Cliente';
const primaryKey = 'clienteId'
class Usuarios extends Component {

    componentDidMount() {
        this.props.activateAuthLayout();
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path={`${this.props.match.url}/crear`} component={Cliente} />
                    <Route path={`${this.props.match.url}/:${primaryKey}`} component={Cliente} />
                    <Route path={`${this.props.match.url}/`} render={() => <ListarView
                        url="/clientes"
                        title="Clientes"
                        newItemButtonText="Registrar Nuevo Cliente"
                        primaryKey={primaryKey}
                        columns={[
                            {
                                Header: 'id', accessor: primaryKey,
                                maxWidth: 50
                            }, {
                                Header: 'Nombre', accessor: "nombre"
                            }, {
                                Header: '# Telefónico', accessor: "numeroTelefono"
                            }, {
                                Header: 'Dirección', accessor: "direccion"
                            }
                        ]}
                    />} />
                </Switch>
            </div>
        )
    }
}

export default withRouter(connect(null, { activateAuthLayout })(Usuarios));