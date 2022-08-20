import React, { Component } from 'react';
import { Button, Row, Col, Alert } from 'reactstrap';
import { Formik, Form } from 'formik';
import { Link, withRouter } from 'react-router-dom';
import * as Yup from "yup";
import BlockUi from 'react-block-ui';
import { Endpoint, PublicHeaders, AUTH_TOKEN_KEY_NAME } from "../../config";
import FormTextField from '../../components/FormTextField';
import Loader from '../../components/Loader'
import { connect } from 'react-redux';

class Pageslogin extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="wrapper">
                    <div className="container-fluid">
                        <Row>
                            <div className="login-bg" />
                            <div className="login-form">
                                <Formik
                                    enableReinitialize
                                    initialValues={{
                                        email: '',
                                        password: ''
                                    }}
                                    validationSchema={Yup.object().shape({
                                        email: Yup.string().required("Este campo es obligatorio"),
                                        password: Yup.string().required("Este campo es obligatorio")
                                    })}
                                    onSubmit={values => {
                                        this.setState(() => ({ blocking: true }));
                                        console.log('endpoint', Endpoint('/usuarios/autenticar'))
                                        fetch(Endpoint('/usuarios/autenticar'), {
                                            method: 'POST',
                                            body: JSON.stringify(values),
                                            headers: PublicHeaders()
                                        }).then(response => {
                                            return response.json();
                                        }).then(response => {
                                            if (response.error) {
                                                throw Error(response.error);
                                            }
                                            return response;
                                        }).then(response => {
                                            this.props.setCurrentUser(response.usuario)
                                            localStorage.setItem(AUTH_TOKEN_KEY_NAME, response.token);
                                            this.props.history.push('/dashboard');
                                        }).catch(err => {
                                            const errorMessage = err.message.includes('fetch') ? 'Revise su conexión a internet' : err.message;
                                            this.setState(() => ({ blocking: false, error: true, errorMessage }));
                                        });
                                    }}
                                >
                                    {({ touched, errors }) => (
                                        <Form>
                                            {
                                                this.state.error &&
                                                <Alert color="danger">
                                                    <span>{this.state.errorMessage}</span>
                                                </Alert>
                                            }
                                            <div className="login-form-body">
                                                <BlockUi tag="div" blocking={this.state.blocking} loader={<Loader />}>
                                                    <Row form>
                                                        <Col>
                                                            <FormTextField
                                                                title="Correo electrónico"
                                                                name="email"
                                                                type="email"
                                                                touched={touched}
                                                                errors={errors}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row form>
                                                        <Col>
                                                            <FormTextField
                                                                title="Contraseña"
                                                                name="password"
                                                                type="password"
                                                                touched={touched}
                                                                errors={errors}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <div className="submit-btn-area">
                                                        <Button
                                                            color="primary"
                                                            className="btn btn-primary"
                                                            type="submit"
                                                        >
                                                            Iniciar sesión
                                                            <i className="ti-arrow-right" />
                                                        </Button>
                                                    </div>
                                                </BlockUi>
                                                <Link
                                                    to="/recuperar-cuenta"
                                                    className="float-right mt-2"
                                                >
                                                    Recuperar contraseña
                                                </Link>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </Row>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    usuario: state.Login.usuario
});

const mapDispatchToProps = dispatch => {
    return {
        setCurrentUser(user) {
            dispatch({
                type: "SET_CURRENT_USER",
                usuario: user
            });
        }
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Pageslogin));