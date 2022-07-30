import React from 'react'
import { Link } from 'react-router-dom';
import BotonCambiarEstado from './BotonCambiarEstado';

export default function OpcionesCell(cellProps) {
    const primaryKey = cellProps.column.id || '';
    const path = cellProps.column.path || '';
    const onDeleteCallback = cellProps.onDeleteCallback || null;
    return (
        <div style={{ width: '100%' }} className="text-center">
            <Link
                className="mr-2"
                to={`${path}/${cellProps.original[primaryKey]}`}
            >
                <i className="feather ft-edit mr-1" />
                <span>Editar</span>
            </Link>
            <BotonCambiarEstado
                url={`${path}/${cellProps.original[primaryKey]}`}
                onDeleteCallback={onDeleteCallback}
            />
        </div>
    )
}
