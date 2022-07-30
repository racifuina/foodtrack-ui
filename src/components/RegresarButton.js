import React from 'react'
import { withRouter } from 'react-router-dom';
import { Button } from 'reactstrap';

function RegresarButton(props) {
    return props.history.length > 1 ? (
        <Button
            color="danger"
            outline
            onClick={props.history.goBack}
        >
            <i className="feather ft-chevron-left" /> Regresar
        </Button>
    ) : (
        <div></div>
    )
}

export default withRouter(RegresarButton);