import React, { useState, Fragment } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader } from 'reactstrap';
import { useMediaQuery } from 'react-responsive';
import BlockUi from 'react-block-ui';
import ReactTable from 'react-table-v6';
import { Endpoint, PrivateHeaders } from "../config";
import Loader from './Loader';
import RightNumberCell from './RightNumberCell'

export default function PedidoCard({ pedido, updatePedido }) {
    const [loading, setLoading] = useState(false);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const width = isTabletOrMobile ? '100%' : '33%';
    const actualizarEstadoPedido = (estadoId) => {
        setLoading(true);
        fetch(Endpoint(`/pedidos/${pedido.pedidoId}/cambiar-estado`), {
            method: 'POST',
            body: JSON.stringify({ estadoId }),
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
        }).then(() => {
            updatePedido(estadoId);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
        });
    }

    return (
        <div style={{ width }} className="pb-3" >
            <Card >
                <CardHeader> {`Pedido # `} <b>{`${pedido.pedidoId}`}</b> <small className="float-right text-muted">{`${pedido.fechaCreacion}`}</small></CardHeader>
                <CardBody className="p-0">
                    <BlockUi tag="div" blocking={loading} loader={<Loader />}>
                        <ReactTable
                            columns={[
                                {
                                    Header: 'Cant.',
                                    accessor: 'cantidad',
                                    maxWidth: 60,
                                    Cell: RightNumberCell
                                }, {
                                    Header: 'Producto',
                                    accessor: 'producto.nombre',
                                }
                            ]}
                            defaultPageSize={pedido.detalles.length}
                            data={pedido.detalles}
                            sortable={false}
                            filterable={false}
                            showPagination={false}
                            resizable={false}
                            className="-striped -highlight"
                        />
                        {
                            [5, 6].includes(pedido.estadoId) && (
                                <div className="p-3">
                                    <b>Dirección de Entrega: </b><br/>
                                    <small>{pedido.direccion}</small>
                                </div>
                            )
                        }
                    </BlockUi>
                </CardBody>
                <CardFooter>
                    {
                        pedido.pedidoId && !['7', '8'].includes(`${pedido.estadoId}`) && (
                            <Fragment>
                                {
                                    pedido.estadoId === 3 && (
                                        <Button
                                            color="primary"
                                            outline
                                            className="mr-1"
                                            onClick={() => actualizarEstadoPedido(4)}
                                        > Cambiar a: <b>En Preparación</b></Button>
                                    )
                                }
                                {
                                    pedido.estadoId === 4 && (
                                        <Button
                                            color="success"
                                            className="mr-1"
                                            onClick={() => actualizarEstadoPedido(5)}
                                        > Cambiar a: <b>Listo Para Enviar</b></Button>
                                    )
                                }
                                {
                                    pedido.estadoId === 5 && (
                                        <Button
                                            color="primary"
                                            outline
                                            className="mr-1"
                                            onClick={() => actualizarEstadoPedido(6)}
                                        > Cambiar a: <b>En Camino</b></Button>
                                    )
                                }
                                {
                                    pedido.estadoId === 6 && (
                                        <Button
                                            color="success"
                                            className="mr-1"
                                            onClick={() => actualizarEstadoPedido(7)}
                                        > Cambiar a: <b>Entregado</b></Button>
                                    )
                                }
                            </Fragment>
                        )
                    }
                </CardFooter>
            </Card>
        </div>
    )
}
