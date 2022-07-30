import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom';
import { activateAuthLayout } from '../../store/actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ListarView from '../../components/ListarView'
import Empleado from './Empleado'
const primaryKey = 'empleadoId';

class Empleados extends Component {
    
    componentDidMount() {
        this.props.activateAuthLayout();
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path={`${this.props.match.url}/crear`} component={Empleado} />
                    <Route path={`${this.props.match.url}/:${primaryKey}`} component={Empleado} />
                    <Route path={`${this.props.match.url}/`} render={() => <ListarView
                        url="/empleados"
                        title="Empleados"
                        newItemButtonText="Crear Nuevo Empleado"
                        primaryKey={primaryKey}
                        columns={[
                            {
                                Header: 'Nombre', accessor: "nombre", id: "1"
                            }, {
                                Header: 'Puesto', accessor: "puesto.nombre", id: "2"
                            }, {
                                Header: 'Usuario', accessor: "usuario.email", id: "3"
                            }
                        ]}
                    />} />
                </Switch>
            </div>
        )
    }
}

export default withRouter(connect(null, { activateAuthLayout })(Empleados));