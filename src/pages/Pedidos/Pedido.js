import React, { Component, Fragment } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Col, Row, Alert, Button, Label, FormGroup } from 'reactstrap';
import * as Yup from "yup";
import Swal from 'sweetalert2';
import BlockUi from 'react-block-ui';
import Loader from '../../components/Loader';
import FormView from '../../components/FormView';
import FormTextField from '../../components/FormTextField';
import TypeaheadField from '../../components/TypeaheadField';
import ModalBitacoraDeEstados from '../../components/ModalBitacoraDeEstados';
import NitField from '../../components/NitField';
import { Endpoint, PrivateHeaders } from "../../config";
import { get } from 'lodash';
import { Link } from 'react-router-dom';
export default class Pedido extends Component {

    constructor(props) {
        super(props)
        const url = props.match.params.pedidoId ? `/${props.match.params.pedidoId}` : '';

        this.state = {
            url: `/pedidos${url}`,
            isNew: true,
            clientes: [],
            productos: [],
            initialValues: {
                pedidoId: '',
                direccion: '',
                email: '',
                numeroTelefono: '',
                nit: '',
                clienteId: '',
                notas: '',
                estadoId: 3,
                detalles: [{
                    productoId: '',
                    cantidad: '',
                    precioUnitario: '',
                    subtotal: 0
                }]
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

        const clientes = fetch(Endpoint('/clientes'), {
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

        const productos = fetch(Endpoint('/productos'), {
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

        Promise.all([clientes, productos]).then(([clientes, productos]) => {
            this.setState(() => ({ clientes, productos }));
            this.getUsuario();
        }).catch(err => {
            const errorMessage = err.message.includes('fetch') ? 'Revise su conexión a internet' : err.message;
            this.setState(() => ({ blocking: false, error: true, errorMessage }));
        });
    }

    getUsuario() {
        if (this.props.match.params.pedidoId) {
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
                const url = `/pedidos/${this.props.match.params.pedidoId}`;
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
                title={this.props.match.params.pedidoId ? `Detalle de Pedido (${this.props.match.params.pedidoId})` : 'Nuevo Pedido'}
                rightOptions={
                    <Fragment>
                        {
                            this.state.initialValues.facturaId && this.state.initialValues.estadoId === 7 && (
                                <Link
                                    className="btn btn-outline-dark mx-2"
                                    to={`/facturas/${this.state.initialValues.facturaId}`}
                                >
                                    <i className="feather ft-dollar-sign" />
                                    Ver Factura
                                </Link>
                            )
                        }
                        {
                            this.state.initialValues.pedidoId && (
                                <ModalBitacoraDeEstados
                                    className=" mx-2"
                                    url={`/pedidos/${this.props.match.params.pedidoId}/changelog`}
                                />
                            )
                        }
                        {
                            this.state.initialValues.pedidoId && !['7', '8'].includes(`${this.state.initialValues.estadoId}`) && (
                                <Fragment>

                                    {
                                        this.state.initialValues.estadoId === 3 && (
                                            <Button
                                                color="primary"
                                                outline
                                                className="mr-1"
                                                onClick={() => {
                                                    this.setState(() => ({ blocking: true }));
                                                    fetch(Endpoint(`${this.state.url}/cambiar-estado`), {
                                                        method: 'POST',
                                                        body: JSON.stringify({ estadoId: 4 }),
                                                        headers: PrivateHeaders(),
                                                    }).then(response => {
                                                        if (response.status === 403) {
                                                            this.props.history.push('/logout');
                                                            throw Error("Debes iniciar sesión para poder accesar a este recurso")
                                                        }
                                                        return response.json();
                                                    }).then(response => {
                                                        if (response.error) {
                                                            throw Error(response.error)
                                                        }
                                                        return response;
                                                    }).then((result) => {
                                                        this.setState(() => ({ blocking: false }));
                                                        Swal.fire(
                                                            'Éxito',
                                                            'El pedido se ha actualizado.',
                                                            'success'
                                                        ).then(() => {
                                                            this.props.history.goBack();
                                                        });
                                                    }).catch(err => {
                                                        const errorMessage = err.message.includes('fetch') ? 'Revise su conexión a internet' : err.message;
                                                        this.setState(() => ({ blocking: false, error: true, errorMessage }));
                                                    });
                                                }}
                                            > Cambiar a: <b>En Preparación</b></Button>
                                        )
                                    }

                                    {
                                        this.state.initialValues.estadoId === 4 && (
                                            <Button
                                                color="info"
                                                outline
                                                className="mr-1"
                                                onClick={() => {
                                                    this.setState(() => ({ blocking: true }));
                                                    fetch(Endpoint(`${this.state.url}/cambiar-estado`), {
                                                        method: 'POST',
                                                        body: JSON.stringify({ estadoId: 5 }),
                                                        headers: PrivateHeaders(),
                                                    }).then(response => {
                                                        if (response.status === 403) {
                                                            this.props.history.push('/logout');
                                                            throw Error("Debes iniciar sesión para poder accesar a este recurso")
                                                        }
                                                        return response.json();
                                                    }).then(response => {
                                                        if (response.error) {
                                                            throw Error(response.error)
                                                        }
                                                        return response;
                                                    }).then((result) => {
                                                        this.setState(() => ({ blocking: false }));
                                                        Swal.fire(
                                                            'Éxito',
                                                            'El pedido se ha actualizado.',
                                                            'success'
                                                        ).then(() => {
                                                            this.props.history.goBack();
                                                        });
                                                    }).catch(err => {
                                                        const errorMessage = err.message.includes('fetch') ? 'Revise su conexión a internet' : err.message;
                                                        this.setState(() => ({ blocking: false, error: true, errorMessage }));
                                                    });
                                                }}
                                            > Cambiar a: <b>Listo Para Enviar</b></Button>
                                        )
                                    }

                                    {
                                        this.state.initialValues.estadoId === 5 && (
                                            <Button
                                                color="primary"
                                                outline
                                                className="mr-1"
                                                onClick={() => {
                                                    this.setState(() => ({ blocking: true }));
                                                    fetch(Endpoint(`${this.state.url}/cambiar-estado`), {
                                                        method: 'POST',
                                                        body: JSON.stringify({ estadoId: 6 }),
                                                        headers: PrivateHeaders(),
                                                    }).then(response => {
                                                        if (response.status === 403) {
                                                            this.props.history.push('/logout');
                                                            throw Error("Debes iniciar sesión para poder accesar a este recurso")
                                                        }
                                                        return response.json();
                                                    }).then(response => {
                                                        if (response.error) {
                                                            throw Error(response.error)
                                                        }
                                                        return response;
                                                    }).then((result) => {
                                                        this.setState(() => ({ blocking: false }));
                                                        Swal.fire(
                                                            'Éxito',
                                                            'El pedido se ha actualizado.',
                                                            'success'
                                                        ).then(() => {
                                                            this.props.history.goBack();
                                                        });
                                                    }).catch(err => {
                                                        const errorMessage = err.message.includes('fetch') ? 'Revise su conexión a internet' : err.message;
                                                        this.setState(() => ({ blocking: false, error: true, errorMessage }));
                                                    });
                                                }}
                                            > Cambiar a: <b>En Camino</b></Button>
                                        )
                                    }

                                    {
                                        this.state.initialValues.estadoId === 6 && (
                                            <Button
                                                color="success"
                                                className="mr-1"
                                                onClick={() => {
                                                    this.setState(() => ({ blocking: true }));
                                                    fetch(Endpoint(`${this.state.url}/cambiar-estado`), {
                                                        method: 'POST',
                                                        body: JSON.stringify({ estadoId: 7 }),
                                                        headers: PrivateHeaders(),
                                                    }).then(response => {
                                                        if (response.status === 403) {
                                                            this.props.history.push('/logout');
                                                            throw Error("Debes iniciar sesión para poder accesar a este recurso")
                                                        }
                                                        return response.json();
                                                    }).then(response => {
                                                        if (response.error) {
                                                            throw Error(response.error)
                                                        }
                                                        return response;
                                                    }).then((result) => {
                                                        this.setState(() => ({ blocking: false }));
                                                        Swal.fire(
                                                            'Éxito',
                                                            'El pedido se ha actualizado.',
                                                            'success'
                                                        ).then(() => {
                                                            this.props.history.goBack();
                                                        });
                                                    }).catch(err => {
                                                        const errorMessage = err.message.includes('fetch') ? 'Revise su conexión a internet' : err.message;
                                                        this.setState(() => ({ blocking: false, error: true, errorMessage }));
                                                    });
                                                }}
                                            > Cambiar a: <b>Entregado</b></Button>
                                        )
                                    }

                                    <Button
                                        color="danger"
                                        className="mr-1"
                                        onClick={() => {
                                            return Swal.fire({
                                                icon: 'question',
                                                title: '¿Esta seguro que desea cancelar este pedido?',
                                                showCancelButton: true,
                                                confirmButtonText: `Sí, estoy seguro`,
                                                confirmButtonColor: '#F2385A',
                                                cancelButtonText: 'No',
                                                showLoaderOnConfirm: true,
                                                preConfirm: () => {
                                                    return fetch(Endpoint(`${this.state.url}/cambiar-estado`), {
                                                        method: 'POST',
                                                        body: JSON.stringify({ estadoId: 8 }),
                                                        headers: PrivateHeaders(),
                                                    }).then(response => {
                                                        if (response.status === 403) {
                                                            this.props.history.push('/logout');
                                                            throw Error("Debes iniciar sesión para poder accesar a este recurso")
                                                        }
                                                        return response.json();
                                                    }).then(response => {
                                                        if (response.error) {
                                                            throw Error(response.error)
                                                        }
                                                        return response;
                                                    }).catch(error => {
                                                        Swal.showValidationMessage(
                                                            `Ocurrió un error: ${error}`
                                                        )
                                                    })
                                                },
                                                allowOutsideClick: () => !Swal.isLoading()
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    Swal.fire(
                                                        'Éxito',
                                                        'El pedido ha sido cancelado.',
                                                        'success'
                                                    ).then(() => {
                                                        this.props.history.goBack();
                                                    });
                                                }
                                            })
                                        }}
                                    > Cancelar Pedido</Button>
                                </Fragment>
                            )
                        }

                    </Fragment>
                }
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
                                        direccion: Yup.string().required("Este campo es obligatorio."),
                                        clienteId: Yup.string().required("Este campo es obligatorio."),
                                        email: Yup.string().email("Debe ser un correo electrónico válido"),
                                        detalles: Yup.array().of(Yup.object().shape({
                                            cantidad: Yup.number().required("Este campo es obligatorio.").integer("Solo números enteros").min(1, "Debe ser un número positivo").typeError('Debe ser un número entero positivo'),
                                            productoId: Yup.string().required("Este campo es obligatorio."),
                                            precioUnitario: Yup.string().required("Este campo es obligatorio.")
                                                .test("no-zero", "Debe ser un número positivo", value => parseFloat(value) > 0 || value === undefined)
                                                .matches(/(^\d{1,10}\.{1}\d{1,2}$|^\d{1,10}$)/, "Ingresar hasta 2 decimales."),
                                            subtotal: Yup.string().required("Este campo es obligatorio.")
                                                .test("no-zero", "Debe ser un número positivo", value => parseFloat(value) > 0 || value === undefined)
                                                .matches(/(^\d{1,10}\.{1}\d{1,2}$|^\d{1,10}$)/, "Ingresar hasta 2 decimales."),
                                        })).min(1, 'Debes agregar al menos 1 producto')
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
                                        const url = `/pedidos`;
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
                                {({ touched, errors, values, setFieldValue }) => (
                                    <BlockUi tag="div" blocking={this.state.blocking} loader={<Loader />}>
                                        <Form>
                                            <Row form>
                                                <Col>
                                                    <TypeaheadField
                                                        title="Cliente"
                                                        name="clienteId"
                                                        autoFocus={true}
                                                        labelKey="nombre"
                                                        type="typeahead"
                                                        filterBy={['nombre', 'numeroTelefono', 'nit', 'direccion']}
                                                        disabled={this.props.match.params.pedidoId}
                                                        options={this.state.clientes}
                                                        optionLabel="nombre"
                                                        touched={touched}
                                                        errors={errors}
                                                        renderMenuItemChildren={option => {
                                                            return (
                                                                <div className="py-0">
                                                                    <b>{option.nombre}</b>
                                                                    <br /> {option.numeroTelefono}
                                                                    <br />  {option.direccion}
                                                                </div>
                                                            )
                                                        }}
                                                        onChange={selected => {
                                                            if (selected) {
                                                                setFieldValue('direccion', selected.direccion)
                                                                setFieldValue('nit', selected.nit)
                                                                setFieldValue('numeroTelefono', selected.numeroTelefono)
                                                                setFieldValue('email', selected.email)
                                                            }
                                                        }} />
                                                </Col>
                                                <Col>
                                                    <FormTextField
                                                        title="Dirección de entrega"
                                                        name="direccion"
                                                        touched={touched}
                                                        errors={errors}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row form>
                                                <Col>
                                                    <FormTextField
                                                        title="Teléfono de contacto"
                                                        name="numeroTelefono"
                                                        touched={touched}
                                                        errors={errors}
                                                    />
                                                </Col>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="nit">NIT Factura</Label>
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
                                                <Col sm={6}>
                                                    <FormTextField
                                                        title="Correo electrónico"
                                                        name="email"
                                                        touched={touched}
                                                        errors={errors}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row form>
                                                <Col>
                                                    <FormTextField
                                                        title="Notas adicionales"
                                                        name="notas"
                                                        touched={touched}
                                                        errors={errors}
                                                    />
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row form>
                                                <Col>
                                                    <h4>Detalle de productos</h4>
                                                </Col>
                                            </Row>
                                            {
                                                values.detalles.map((detalle, index) => {
                                                    return (
                                                        <Fragment key={index}>
                                                            <Row form>
                                                                <Col xs={2} sm={2} >
                                                                    <FormGroup>
                                                                        <Label for={`detalles[${index}].cantidad`}>Cantidad</Label>
                                                                        <Field
                                                                            type="text"
                                                                            name={`detalles[${index}].cantidad`}
                                                                            autoComplete="off"
                                                                            onChange={e => {
                                                                                const value = `${e.currentTarget.value}`;
                                                                                setFieldValue(`detalles[${index}].cantidad`, value)
                                                                                const cantidad = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
                                                                                const precioUnitario = !isNaN(parseFloat(get(values, `detalles[${index}].precioUnitario`))) ? parseFloat(get(values, `detalles[${index}].precioUnitario`)) : 0;
                                                                                const subtotal = precioUnitario * cantidad;
                                                                                setFieldValue(`detalles[${index}].subtotal`, subtotal.toFixed(2))
                                                                            }}
                                                                            value={get(values, `detalles[${index}].cantidad`)}
                                                                            className={`form-control ${get(touched, `detalles[${index}].cantidad`) && get(errors, `detalles[${index}].cantidad`) ? "is-invalid" : ""}`}
                                                                        />
                                                                        <ErrorMessage
                                                                            component="div"
                                                                            name={`detalles[${index}].cantidad`}
                                                                            className="invalid-feedback"
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col xs={6} sm={5}>
                                                                    <FormGroup>
                                                                        <Label for={`detalles[${index}].productoId`}>Producto</Label>
                                                                        <Field
                                                                            as="select"
                                                                            name={`detalles[${index}].productoId`}
                                                                            touched={touched}
                                                                            errors={errors}
                                                                            onChange={e => {
                                                                                const value = `${e.currentTarget.value}`;
                                                                                const productoId = parseInt(value);
                                                                                const producto = value.length ? this.state.productos.find(p => p.productoId === productoId) : { precio: 0 };
                                                                                const cantidad = !isNaN(parseFloat(get(values, `detalles[${index}].cantidad`))) ? parseFloat(get(values, `detalles[${index}].cantidad`)) : 0;
                                                                                const precioUnitario = parseFloat(producto.precio);
                                                                                const subtotal = precioUnitario * cantidad;
                                                                                setFieldValue(`detalles[${index}].precioUnitario`, precioUnitario.toFixed(2))
                                                                                setFieldValue(`detalles[${index}].subtotal`, subtotal.toFixed(2))
                                                                                setFieldValue(`detalles[${index}].productoId`, productoId)
                                                                            }}
                                                                            value={get(values, `detalles[${index}].productoId`)}
                                                                            className={`form-control ${get(touched, `detalles[${index}].productoId`) && get(errors, `detalles[${index}].productoId`) ? "is-invalid" : ""}`}
                                                                        >
                                                                            <Fragment>
                                                                                <option value=""></option>
                                                                                {
                                                                                    this.state.productos.map(item => {
                                                                                        return <option key={item.productoId} value={item.productoId}>{`${item.nombre}`}</option>
                                                                                    })
                                                                                }
                                                                            </Fragment>
                                                                        </Field>
                                                                        <ErrorMessage
                                                                            component="div"
                                                                            name={`detalles[${index}].productoId`}
                                                                            className="invalid-feedback"
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col xs={4} sm={2} >
                                                                    <FormGroup>
                                                                        <Label for={`detalles[${index}].precioUnitario`}>Precio Unitario</Label>
                                                                        <Field
                                                                            type="text"
                                                                            name={`detalles[${index}].precioUnitario`}
                                                                            autoComplete="off"
                                                                            disabled
                                                                            onChange={e => {
                                                                                const value = `${e.currentTarget.value}`;
                                                                                const cantidad = !isNaN(parseFloat(get(values, `detalles[${index}].cantidad`))) ? parseFloat(get(values, `detalles[${index}].cantidad`)) : 0;
                                                                                const precioUnitario = !isNaN(parseFloat(e.currentTarget.value)) ? parseFloat(e.currentTarget.value) : 0;
                                                                                const subtotal = precioUnitario * cantidad;
                                                                                setFieldValue(`detalles[${index}].precioUnitario`, value)
                                                                                setFieldValue(`detalles[${index}].subtotal`, subtotal.toFixed(2))
                                                                            }}
                                                                            value={get(values, `detalles[${index}].precioUnitario`)}
                                                                            className={`form-control ${get(touched, `detalles[${index}].precioUnitario`) && get(errors, `detalles[${index}].precioUnitario`) ? "is-invalid" : ""}`}
                                                                        />
                                                                        <ErrorMessage
                                                                            component="div"
                                                                            name={`detalles[${index}].precioUnitario`}
                                                                            className="invalid-feedback"
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col xs={6} sm={2} >
                                                                    <FormGroup>
                                                                        <Label for={`detalles[${index}].subtotal`}>Subtotal</Label>
                                                                        <Field
                                                                            type="text"
                                                                            disabled
                                                                            name={`detalles[${index}].subtotal`}
                                                                            autoComplete="off"
                                                                            className={`form-control ${get(touched, `detalles[${index}].subtotal`) && get(errors, `detalles[${index}].subtotal`) ? "is-invalid" : ""}`}
                                                                        />
                                                                        <ErrorMessage
                                                                            component="div"
                                                                            name={`detalles[${index}].subtotal`}
                                                                            className="invalid-feedback"
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col xs={6} xl={1} className="p-0 pr-3">
                                                                    <FormGroup>
                                                                        <Label for={`detalles[${index}].submit`}></Label>
                                                                        <Button
                                                                            color="danger"
                                                                            className="mt-2 pr-0 pl-0"
                                                                            onClick={() => {
                                                                                const detalles = values.detalles
                                                                                detalles.splice(index, 1);
                                                                                setFieldValue('detalles', detalles)
                                                                            }}
                                                                            block
                                                                            disabled={this.state.blocking}
                                                                        >
                                                                            <small>Eliminar</small>
                                                                        </Button>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </Fragment>
                                                    )
                                                })
                                            }
                                            <Row className="pt-3">
                                                {`${this.state.initialValues.estadoId}` === '3' && (
                                                    <Col>
                                                        <div className="float-right">
                                                            <Button
                                                                onClick={() => {
                                                                    const detalles = values.detalles;
                                                                    detalles.push({
                                                                        productoId: '',
                                                                        cantidad: '',
                                                                        precioUnitario: '',
                                                                        subtotal: 0
                                                                    })
                                                                    setFieldValue('detalles', detalles);
                                                                }}
                                                                outline
                                                                color='primary'
                                                            >
                                                                Agregar Producto
                                                            </Button>

                                                        </div>
                                                    </Col>
                                                )}
                                                <Col>
                                                    <h4 className="float-right text-primary">Total Pedido: Q {values.detalles.reduce((total, item) => total + parseFloat(item.subtotal), 0).toFixed(2)}</h4>
                                                    {
                                                        touched.detalles && errors.detalles && typeof errors.detalles === 'string' ?
                                                            <small className="text-danger">{errors.detalles}</small>
                                                            : null
                                                    }
                                                </Col>
                                            </Row>
                                            {
                                                !['7', '8'].includes(`${this.state.initialValues.estadoId}`) && (
                                                    <Fragment>
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
                                                    </Fragment>
                                                )
                                            }

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
