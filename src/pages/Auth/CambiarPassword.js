import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Endpoint, PublicHeaders } from "../../config";
import Loader from '../../components/Loader'

class CambiarPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event, values) {
        this.setState(() =>({ loading: true }));
        const valores = { token: this.props.match.params.token, password: values.password };
        fetch(Endpoint('/usuarios/cambiar-password'), {
            method: 'POST',
            body: JSON.stringify(valores),
            headers: PublicHeaders()
        }).then(response => {
            return response.json();
        }).then(response => {
            console.error(response)
            if (response.error) {
                throw Error(response.error);
            }
            return response;
        }).then(response => {
            Swal.fire(
                'Éxito',
                response.mensaje,
                'success'
            ).then(() => this.props.history.push('/login'))
        }).catch(err => {
            console.error(err)
            const errorMessage = err.message.includes('fetch') ? 'Revise su conexión a internet' : err.message;
            this.setState(() => ({ loading: false, error: true, errorMessage }));
        });
    }


    render() {
        return (
            <React.Fragment>
                <div className="lock-screen forget_bg">
                    <div className="login-form credentials-form">
                        <AvForm className="form-horizontal m-t-30" onValidSubmit={this.handleSubmit} >
                            <div className="lock-form-head">
                                <h4>Recuperación de contraseña</h4>
                                <p>Por favor ingrese una nueva contraseña</p>
                            </div>
                            <div className="login-form-body text-center">
                                <div className="mb-0 text-left">
                                    <AvField name="password" label="Contraseña" type="password" required />
                                    <div className="submit-btn-area">
                                        {this.state.loading ? <Loader /> :
                                            <Button color="primary" className="btn btn-primary" type="submit">Cambiar Contraseña <i className="ti-arrow-right"></i></Button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </AvForm>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

export default withRouter(CambiarPassword);

