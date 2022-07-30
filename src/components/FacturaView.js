import React from 'react'
import { Col, Row, Card, CardBody } from 'reactstrap';

export default function FacturaView({ factura }) {
    return (
        <div>
           
            <Row>
                <Col lg="12" className="stretched_card">
                    <Card>
                        <CardBody>
                            <div className="invoice-area">
                                <div className="invoice-head">
                                    <div className="row">
                                        <div className="iv-left col-lg-6 ">
                                            <span className="text-primary">FOODTRACK, S.A.</span><small className="ml-2" >| NIT: 5254252-K | DIRECCIÓN: 6 AVENIDA 2-44 ZONA 2 </small><br />
                                        </div>
                                        <div className="iv-right col-lg-6 text-md-right">
                                            <small>Factura Electrónica Número: </small>
                                            <span>{factura.facturaId}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <div className="invoice-address">

                                            <h6><small>Receptor: </small>{factura.nombreReceptor}</h6>
                                            <p>
                                                <small>NIT: </small>{factura.nit}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-md-right">
                                        <ul className="invoice-date">
                                            <li><small>Fecha Emisión :</small> {factura.fechaEmision}</li>
                                            <li><small>Serie :</small> {factura.serie}</li>
                                            <li><small>Autorización :</small> {factura.uid}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="invoice-table table-responsive mt-5">
                                    <table className="table table-bordered table-hover text-right">
                                        <thead>
                                            <tr className="text-capitalize">
                                                <th className="text-center">Cantidad</th>
                                                <th className="text-left">Descripción</th>
                                                <th>Precio Unitario</th>
                                                <th>Descuento</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                factura.detalles.map(detalle => {
                                                    return (
                                                        <tr>
                                                            <td className="text-center">{detalle.cantidad}</td>
                                                            <td className="text-left">{detalle.descripcion}</td>
                                                            <td>Q {detalle.precioUnitario}</td>
                                                            <td>Q {detalle.descuento}</td>
                                                            <td>Q {detalle.subtotal}</td>
                                                        </tr>
                                                    )
                                                })
                                            }


                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="4">Total :</td>
                                                <td>Q {factura.detalles.reduce((total, item) => total + parseFloat(item.subtotal), 0).toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                    <small>SUJETO A PAGOS TRIMESTRALES</small>
                                    <br />
                                    <small>Datos del Certificador: 77454820, Digifact Servicios S.A,</small>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
