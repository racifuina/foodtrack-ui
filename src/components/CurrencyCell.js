import React from 'react'

export default function CurrencyCell(props) {
    const decimals = props.decimals || 2;
    const currency = props.currency || 'Q';
    const style = { ...props.column.style };

    style.width = '100%';
    style.textAlign = 'right';
    style.whiteSpace = 'nowrap';
    style.wordWrap = 'elipsis';
    style.overflow = 'scroll';

    const value = parseFloat(props.value).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return (
        <div style={style} >
            <span title={value}>{currency}&nbsp;{value}</span>
        </div>
    )
}
