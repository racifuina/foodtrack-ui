import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom';
import { activateAuthLayout } from '../../store/actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ListarView from '../../components/ListarView'
import Rol from './Rol';
import RolesPermisos from './RolesPermisos';
const primaryKey = 'rolId';
class Roles extends Component {

    componentDidMount() {
        this.props.activateAuthLayout();
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path={`${this.props.match.url}/crear`} component={Rol} />
                    <Route path={`${this.props.match.url}/:${primaryKey}/permisos`} component={RolesPermisos} />
                    <Route path={`${this.props.match.url}/:${primaryKey}`} component={Rol} />
                    <Route path={`${this.props.match.url}/`} render={() => <ListarView
                        url="/roles"
                        title="Roles"
                        newItemButtonText="Crear Nuevo Rol"
                        primaryKey={primaryKey}
                        columns={[
                            {
                                Header: 'Nombre', accessor: "nombre", id: "1"
                            },
                        ]}
                    />} />
                </Switch>
            </div>
        )
    }
}

export default withRouter(connect(null, { activateAuthLayout })(Roles));