import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { activateAuthLayout } from '../../store/actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/es'  // without this line it didn't work

class Dashboard extends Component {
    constructor(props) {
        super(props);
        const hoy = moment();
        hoy.locale('es');
        this.state = {
            hoy: hoy.format('DD MMMM')
        };
    }

    componentDidMount() {
        this.props.activateAuthLayout();
    }

    render() {
        return (
            <div style={{height: 'calc(100vh - 145px)'}}>
            <Row >
                <Col lg="12" className="rt_subheader" >
                    <div className="rt_subheader_main">
                        <h3 className="rt_subheader_title mb-mob-2">Hola {this.props.usuario.nombre}</h3>
                    </div>
                    <div className="subheader_btns">
                        <Button color="inverse-primary">
                            <span>{this.state.hoy}</span>
                            <i className="feather ft-calendar ml-2"></i>
                        </Button>
                    </div>
                </Col>
            </Row>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    usuario: state.Login.usuario
});


export default withRouter(connect(mapStateToProps, { activateAuthLayout })(Dashboard));
