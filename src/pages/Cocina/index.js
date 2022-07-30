import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom';
import { activateAuthLayout } from '../../store/actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PedidosView from '../../components/PedidosView'
const primaryKey = 'pedidoId';

class Cocina extends Component {

    componentDidMount() {
        this.props.activateAuthLayout();
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path={`${this.props.match.url}/`} render={() => <PedidosView
                        url="/pedidos/cocina"
                        title="Cocina"
                        primaryKey={primaryKey}
                    />} />
                </Switch>
            </div>
        )
    }
}

export default withRouter(connect(null, { activateAuthLayout })(Cocina));