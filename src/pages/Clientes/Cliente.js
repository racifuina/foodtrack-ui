import React, { Component, Fragment } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Col, Row, Alert, Button, FormGroup, Label } from 'reactstrap';
import * as Yup from "yup";
import BlockUi from 'react-block-ui';
import Swal from 'sweetalert2'
import FormView from '../../components/FormView';
import FormTextField from '../../components/FormTextField';
import NitField from '../../components/NitField';
import { Endpoint, PrivateHeaders } from "../../config";
import Loader from '../../components/Loader';

export default class Cliente extends Component {

    constructor(props) {
        super(props)
        const url = props.match.params.clienteId ? `/${props.match.params.clienteId}` : '';

        this.state = {
            url: `/clientes${url}`,
            isNew: true,
            puestos: [],
            roles: [],
            initialValues: {
                clienteId: '',
                nombre: '',
                numeroTelefono: '',
                email: '',
                nit: '',
                direccion: '',
                estadoId: 1,
            }
        }
        this.getCliente = this.getCliente.bind(this);
    }

    componentDidMount() {
        this.getCliente();
    }

    getCliente() {
        this.setState(() => ({ blocking: true }));
        if (this.props.match.params.clienteId) {
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
                const url = `/clientes/${this.props.match.params.clienteId}`;
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
                title={this.props.match.params.clienteId ? 'Editar Cliente' : 'Nuevo Cliente'}
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
                                        numeroTelefono: Yup.string().required("Este campo es obligatorio."),
                                        email: Yup.string().email("Debe ser un correo electrónico válido"),
                                        nit: Yup.string().required("Este campo es obligatorio."),
                                        direccion: Yup.string().required("Este campo es obligatorio.").nullable(),
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
                                        const url = `/clientes`;
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
                                                    <FormGroup>
                                                        <Label for="nit">Número de Identificación Tributaria (NIT)</Label>
                                                        <Field
                                                            as={NitField}
                                                            name="nit"
                                                            className={`form-control ${touched.nit && errors.nit ? "is-invalid" : ""}`}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="nit"
                                                            className="invalid-feedback"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row form>

                                                <Col>
                                                    <FormTextField
                                                        title="Número Telefónico"
                                                        name="numeroTelefono"
                                                        touched={touched}
                                                        max={8}
                                                        errors={errors}
                                                    />
                                                </Col>
                                                <Col>
                                                    <FormTextField
                                                        title="Correo electrónico"
                                                        name="email"
                                                        touched={touched}
                                                        max={8}
                                                        errors={errors}
                                                    />
                                                </Col>

                                            </Row>
                                            <Row form>
                                                <Col>
                                                    <FormTextField
                                                        title="Direción de entrega"
                                                        name="direccion"
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
