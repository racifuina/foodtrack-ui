import React, { Component, Fragment } from 'react'
import FormView from '../../components/FormView'
import FormTextField from '../../components/FormTextField'
import Loader from '../../components/Loader'
import { Formik, Form } from 'formik';
import { Col, Row, Alert, Button } from 'reactstrap';
import * as Yup from "yup";
import { Endpoint, PrivateHeaders } from "../../config";
import BlockUi from 'react-block-ui';
import Swal from 'sweetalert2'

export default class Usuario extends Component {

    constructor(props) {
        super(props)
        const url = props.match.params.usuarioId ? `/${props.match.params.usuarioId}` : '';

        this.state = {
            url: `/usuarios${url}`,
            isNew: true,
            empleados: [],
            roles: [],
            initialValues: {
                usuarioId: '',
                email: '',
                empleadoId: '',
                rolId: '',
                estadoId: 1,
            }
        }
        this.getUsuario = this.getUsuario.bind(this);
        this.getInitialData = this.getInitialData.bind(this);
    }

    componentDidMount() {
        this.getInitialData();
    }

    getInitialData() {
        this.setState(() => ({ blocking: true }));

        const empleados = fetch(Endpoint('/empleados'), {
            method: 'GET',
            headers: PrivateHeaders()
        }).then(response => {
            if (response.status === 401) {
                this.props.history.push('/logout');
                throw Error("Debes iniciar sesión para poder accesar a este recurso");
            }
            return response.json();
        }).then(response => {
            if (response.error) {
                throw Error(response.error);
            }
            return response;
        });

        const roles = fetch(Endpoint('/roles'), {
            method: 'GET',
            headers: PrivateHeaders()
        }).then(response => {
            if (response.status === 401) {
                this.props.history.push('/logout');
                throw Error("Debes iniciar sesión para poder accesar a este recurso");
            }
            return response.json();
        }).then(response => {
            if (response.error) {
                throw Error(response.error);
            }
            return response;
        });

        Promise.all([empleados, roles]).then(([empleados, roles]) => {
            if (!this.props.match.params.usuarioId) {
                empleados = empleados.filter(empleado => empleado.usuario === null);
            }
            empleados = empleados.map(item => {
                item.display = `${item.nombre} -  ${item.puesto.nombre}`
                return item;
            })
            this.setState(() => ({ empleados, roles }));
            this.getUsuario();
        }).catch(err => {
            const errorMessage = err.message.includes('fetch') ? 'Revise su conexión a internet' : err.message;
            this.setState(() => ({ blocking: false, error: true, errorMessage }));
        });
    }

    getUsuario() {
        if (this.props.match.params.usuarioId) {
            fetch(Endpoint(this.state.url), {
                method: 'GET',
                headers: PrivateHeaders()
            }).then(response => {
                if (response.status === 401) {
                    this.props.history.push('/logout');
                    throw Error("Debes iniciar sesión para poder accesar a este recurso");
                }
                return response.json();
            }).then(response => {
                if (response.error) {
                    throw Error(response.error);
                }
                return response;
            }).then(initialValues => {
                const url = `/usuarios/${this.props.match.params.usuarioId}`;
                this.setState(() => ({ initialValues, url, isNew: false, blocking: false }));
            }).catch(err => {
                const errorMessage = err.message.includes('fetch') ? 'Revise su conexión a internet' : err.message;
                this.setState(() => ({ blocking: false, error: true, errorMessage }));
            });
        } else {
            this.setState(() => ({ blocking: false }));
        }
    }

    render() {
        return (
            <FormView
                title={this.props.match.params.usuarioId ? 'Editar Usuario' : 'Nuevo Usuario'}
            >
                <Fragment>
                    {
                        this.state.error ?
                            <Alert color="danger">
                                <span>{this.state.errorMessage}</span>
                            </Alert>
                            :
                            <Formik
                                enableReinitialize
                                initialValues={this.state.initialValues}
                                validationSchema={
                                    Yup.object().shape({
                                        email: Yup.string().required("Este campo es obligatorio."),
                                        rolId: Yup.string().required("Este campo es obligatorio."),
                                        empleadoId: Yup.string().required("Este campo es obligatorio.")
                                    })
                                }
                                onSubmit={values => {
                                    this.setState(() => ({ blocking: true }));
                                    fetch(Endpoint(this.state.url), {
                                        method: 'POST',
                                        body: JSON.stringify(values),
                                        headers: PrivateHeaders()
                                    }).then(response => {
                                        if (response.status === 401) {
                                            this.props.history.push('/logout');
                                            throw Error("Debes iniciar sesión para poder accesar a este recurso");
                                        }
                                        return response.json();
                                    }).then(response => {
                                        if (response.error) {
                                            throw Error(response.error);
                                        }
                                        return response;
                                    }).then(initialValues => {
                                        const url = `/usuarios`;
                                        Swal.fire(
                                            'Éxito',
                                            'Los datos se han guardado exitosamente.',
                                            'success'
                                        ).then(() => {
                                            this.props.history.goBack();
                                        });

                                        this.setState(() => ({ initialValues, url, blocking: false, isNew: false }));
                                    }).catch(err => {
                                        const errorMessage = err.message.includes('fetch') ? 'Revise su conexión a internet' : err.message;
                                        this.setState(() => ({ blocking: false, error: true, errorMessage }));
                                    });
                                }}
                            >
                                {({ touched, errors }) => (
                                    <BlockUi tag="div" blocking={this.state.blocking} loader={<Loader />}>
                                        <Form>
                                            <Row form>
                                                <Col>
                                                    <FormTextField
                                                        title="Correo electrónico"
                                                        name="email"
                                                        touched={touched}
                                                        errors={errors}
                                                        autoFocus={true}
                                                    />
                                                </Col>
                                                <Col>
                                                    <FormTextField
                                                        title="Empleado"
                                                        name="empleadoId"
                                                        as="select"
                                                        disabled={this.props.match.params.usuarioId}
                                                        options={this.state.empleados}
                                                        optionLabel="display"
                                                        touched={touched}
                                                        errors={errors}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row form >
                                                <Col>
                                                    <FormTextField
                                                        title="Rol"
                                                        name="rolId"
                                                        as="select"
                                                        options={this.state.roles}
                                                        optionLabel="nombre"
                                                        touched={touched}
                                                        errors={errors}
                                                    />
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row form >
                                                <Col>
                                                    <Button
                                                        color="success"
                                                        type="Submit"
                                                    >
                                                        Guardar
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </BlockUi>
                                )}
                            </Formik>
                    }
                </Fragment>

            </FormView >
        )
    }
}
