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

export default class Producto extends Component {

    constructor(props) {
        super(props)
        const url = props.match.params.productoId ? `/${props.match.params.productoId}`: '';

        this.state = {
            url: `/productos${url}`,
            isNew: true,
            initialValues: {
                productoId: '',
                nombre: '',
                precio: '',
                descripcion: ''
            }
        }
        this.getProducto = this.getProducto.bind(this)
    }

    componentDidMount() {
        this.getProducto()
    }

    getProducto() {
        this.setState(() => ({ blocking: true }));
        if (this.props.match.params.productoId) {

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
                const url = `/productos/${this.props.match.params.productoId}`;
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
                title={this.props.match.params.productoId ? 'Editar Producto' : 'Nuevo Producto'}
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
                                        descripcion: Yup.string().required("Este campo es obligatorio."),
                                        precio: Yup.string().matches(/(^\d{1,10}\.{1}\d{1,2}$|^\d{1,10}$)/, "Debe ser un número de hasta 2 decimales.")
                                            .test("no-zero", "Debe ser un número mayor a 0", value => parseFloat(value) > 0 || value === undefined)
                                            .required("Este campo es obligatorio."),
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
                                        const url = `/productos`;
                                        Swal.fire(
                                            'Éxito',
                                            'Los datos se han guardado exitosamente.',
                                            'success'
                                        ).then(() => {
                                            this.props.history.goBack();
                                        });

                                        this.setState(() => ({ initialValues, url,blocking: false, isNew: false }));
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
                                                        title="Nombre"
                                                        name="nombre"
                                                        touched={touched}
                                                        errors={errors}
                                                        autoFocus={true}
                                                    />
                                                </Col>
                                                <Col>
                                                    <FormTextField
                                                        title="Precio (GTQ)"
                                                        name="precio"
                                                        touched={touched}
                                                        errors={errors}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row form >
                                                <Col>
                                                    <FormTextField
                                                        title="Descripción"
                                                        name="descripcion"
                                                        as="textarea"
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
