import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom';
import { activateAuthLayout } from '../../store/actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ListarView from '../../components/ListarView'
import Usuario from './Usuario'
const primaryKey = 'usuarioId';
class Usuarios extends Component {
    
    componentDidMount() {
        this.props.activateAuthLayout();
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path={`${this.props.match.url}/crear`} component={Usuario} />
                    <Route path={`${this.props.match.url}/:${primaryKey}`} component={Usuario} />
                    <Route path={`${this.props.match.url}/`} render={() => <ListarView
                        url="/usuarios"
                        title="Usuarios"
                        newItemButtonText="Crear Nuevo Usuario"
                        primaryKey={primaryKey}
                        columns={[
                            {
                                Header: 'Correo Electrónico', accessor: "email", id: "1"
                            }, {
                                Header: 'Rol', accessor: "rol.nombre", id: "2"
                            }, {
                                Header: 'Empleado', accessor: "empleado.nombre", id: "3"
                            }
                        ]}
                    />} />
                </Switch>
            </div>
        )
    }
}

export default withRouter(connect(null, { activateAuthLayout })(Usuarios));