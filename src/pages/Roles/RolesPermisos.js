import React, { Component } from 'react'
import ListarView from '../../components/ListarView'
import { Endpoint, PrivateHeaders } from "../../config";

export default class RolesPermisos extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tiposAutorizaciones: [
                {
                    tipoAutorizacionId: 0,
                    nombre: 'Denegado',
                }, {
                    tipoAutorizacionId: 1,
                    nombre: 'Lectura',
                }, {
                    tipoAutorizacionId: 2,
                    nombre: 'Escritura',
                }
            ]
        }
    }

    render() {
        return (
            <ListarView
                url={`/roles-permisos?rolId=${this.props.match.params.rolId}`}
                title="Permisos del Rol"
                hideCreateButton={true}
                showBackButton={true}
                showDefaultOptions={false}
                upda
                columns={
                    [
                        {
                            Header: 'Permiso', accessor: "permiso", id: "1"
                        }, {
                            Header: 'Autorización', accessor: "tipoAutorizacionId", id: "2",
                            className: "p-0 m-0",
                            Cell: cellData => {
                                return <select
                                    className="form-control"
                                    style={{ width: "100%" }}
                                    value={cellData.original.tipoAutorizacionId}
                                    onChange={e => {
                                        this.setState(() => { return { blocking: true } })
                                        const tipoAutorizacionId = e.currentTarget.value;
                                        fetch(Endpoint(`/roles-permisos`), {
                                            method: 'POST',
                                            body: JSON.stringify({
                                                rolId: this.props.match.params.rolId,
                                                permisoId: cellData.original.permisoId,
                                                tipoAutorizacionId
                                            }),
                                            headers: PrivateHeaders()
                                        }).then(response => {
                                            if (response.status === 401) {
                                                this.props.history.push('/auth/logout');
                                                throw Error("Debes iniciar sesión para poder accesar a este recurso")
                                            }
                                            return response.json();
                                        }).then(response => {
                                            if (response.error) {
                                                throw Error(response.error)
                                            }
                                            return response;
                                        }).then(rolPermiso => {
                                            console.log(`rolPermiso`, rolPermiso)
                                            window.location.reload();
                                        }).catch(err => {
                                            this.setState(() => ({ blocking: false }));
                                            console.error(err);
                                        });
                                    }}
                                >
                                    {
                                        this.state.tiposAutorizaciones.map(tipoAutorizacion => {
                                            return <option key={tipoAutorizacion.tipoAutorizacionId} value={tipoAutorizacion.tipoAutorizacionId}>{tipoAutorizacion.nombre}</option>
                                        })
                                    }
                                </select>
                            }
                        },

                    ]}
            />
        )
    }
}
