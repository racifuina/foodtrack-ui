import React from 'react'
import Swal from 'sweetalert2'
import { Endpoint, PrivateHeaders } from "../config";

export default function BotonCambiarEstado({ url, onDeleteCallback }) {
    return (
        <button
            className="mx-3 text-danger bg-transparent p-0"
            onClick={(e) => {
                e.preventDefault();
                return Swal.fire({
                    icon: 'question',
                    title: '¿Esta seguro que desea dar de baja este elemento?',
                    showCancelButton: true,
                    confirmButtonText: `Sí, estoy seguro`,
                    confirmButtonColor: '#F2385A',
                    cancelButtonText: 'No',
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        return fetch(Endpoint(url), {
                            method: 'DELETE',
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
                            'El elemento se ha eliminado',
                            'success'
                        ).then(() => onDeleteCallback ? onDeleteCallback() : null)
                    }
                })
            }}
        >
            <i className="feather ft-trash-2 mr-1" />
            <span>Eliminar</span>
        </button>
    )
}
