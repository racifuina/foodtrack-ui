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

export default class Empleado extends Component {

    constructor(props) {
        super(props)
        const url = props.match.params.empleadoId ? `/${props.match.params.empleadoId}` : '';

        this.state = {
            url: `/empleados${url}`,
            isNew: true,
            puestos: [],
            roles: [],
            initialValues: {
                empleadoId: '',
                nombre: '',
                puestoId: '',
                estadoId: 1,
            }
        }
        this.getEmpleado = this.getEmpleado.bind(this);
        this.getInitialData = this.getInitialData.bind(this);
    }

    componentDidMount() {
        this.getInitialData();
    }

    getInitialData() {
        this.setState(() => ({ blocking: true }));

        const puestos = fetch(Endpoint('/puestos'), {
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

        Promise.all([puestos]).then(([puestos]) => {
            this.setState(() => ({ puestos }));
            this.getEmpleado();
        }).catch(err => {
            const errorMessage = err.message.includes('fetch') ? 'Revise su conexión a internet' : err.message;
            this.setState(() => ({ blocking: false, error: true, errorMessage }));
        });
    }

    getEmpleado() {
        if (this.props.match.params.empleadoId) {
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
                const url = `/empleados/${this.props.match.params.empleadoId}`;
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
                title={this.props.match.params.empleadoId ? 'Editar Empleado' : 'Nuevo Empleado'}
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
                                        nombre: Yup.string().required("Este campo es obligatorio."),
                                        puestoId: Yup.string().required("Este campo es obligatorio."),
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
                                        const url = `/empleados`;
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
                                                        title="Nombre Completo"
                                                        name="nombre"
                                                        touched={touched}
                                                        errors={errors}
                                                        autoFocus={true}
                                                    />
                                                </Col>
                                                <Col>
                                                    <FormTextField
                                                        title="Puesto"
                                                        name="puestoId"
                                                        as="select"
                                                        options={this.state.puestos}
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
