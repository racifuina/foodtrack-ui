import React from 'react'
import ReactTable from 'react-table-v6'

export default function Tabla({ columns = [], data = [], filterable = false }) {
    return (
        <ReactTable
            columns={columns}
            data={data}
            filterable={filterable}
            defaultFilterMethod={(filter, row) => String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())}
            defaultPageSize={window.innerHeight <= 768 ? 12 : 18}
            pageSizeOptions={[6, 12, 18, 24, 48]}
            previousText="Página anterior"
            nextText="Página siguiente"
            pageText="Página"
            rowsText="Filas"
            ofText="de"
            noDataText="No se encontraron resultados"
            className="-striped -highlight"
        />
    )
}
