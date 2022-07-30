import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import RegresarButton from './RegresarButton'

class FormView extends Component {
    render() {
        return (
            <div className="mb-2" style={{ minHeight: 'calc(100vh - 155px)' }}>
                <div className="rt_subheader mb-2" >
                    <div className="rt_subheader_main">
                        <h3 className="rt_subheader_title mb-mob-2">{this.props.title}</h3>
                    </div>
                    <div className="subheader_btns">
                        {
                            this.props.rightOptions 
                        }
                        <RegresarButton />
                    </div>
                </div>
                <Card>
                    <CardBody>
                        {this.props.children}
                    </CardBody>
                </Card>
            </div>

        )
    }
}


export default withRouter(FormView);