import React from 'react'

export default function Loader() {
    return (
        <div style={{width: "100%"}} className="text-center">
            <div className="ring_loader primary_ring_loader">
                <div></div><div></div><div></div><div></div>
            </div>
        </div>
    )
}
