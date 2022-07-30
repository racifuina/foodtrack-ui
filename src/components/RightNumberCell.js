import React from 'react'

export default function RightNumberCell(cellData) {
    const style = { ...cellData.column.style };
    style.width = '100%';
    style.textAlign = 'right';
    return (
        <div style={style}>
            {parseFloat(cellData.value).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
    )
}