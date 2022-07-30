import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { activateAuthLayout } from '../../store/actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ListarView from '../../components/ListarView';
import CurrencyCell from '../../components/CurrencyCell';
import Producto from './Producto';

class Productos extends Component {

    componentDidMount() {
        this.props.activateAuthLayout();
    }

    render() {
        return (
            <Switch>
                <Route path={`${this.props.match.url}/crear`} component={Producto} />
                <Route path={`${this.props.match.url}/:productoId`} component={Producto} />
                <Route path={`${this.props.match.url}/`} render={() => <ListarView
                    url="/productos"
                    title="Productos"
                    newItemButtonText="Crear Nuevo Producto"
                    primaryKey="productoId"
                    columns={[
                        {
                            Header: 'id',
                            maxWidth: 50,
                            accessor: "productoId",
                            id: "llave"
                        }, {
                            Header: 'Nombre',
                            accessor: "nombre"
                        }, {
                            Header: 'Precio',
                            accessor: "precio",
                            Cell: CurrencyCell
                        }
                    ]}
                />} />
            </Switch>
        )
    }
}

export default withRouter(connect(null, { activateAuthLayout })(Productos));