import React from 'react'

export default function DefaultTableFilter() {
    return (
        <input
            onChange={event => onChange(event.target.value)}
            style={{ width: "100%" }}
            autoComplete="off"
            maxLength={50}
        />
    )
}
