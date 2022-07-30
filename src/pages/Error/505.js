import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { activateNonAuthLayout } from '../../store/actions';
import { connect } from 'react-redux';

class PageNotFound extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.props.activateNonAuthLayout();
    }

    render() {
        return (
            <React.Fragment>
                <div id="notfound">
                    <div class="notfound">
                        <div class="notfound-404">
                            <h1>505</h1>
                        </div>
                        <h2>Internal server error</h2>
                        <p>The server does not support the HTTP protocol version used in the request.</p>
                        <Link to="dashboard" class="btn btn-primary btn-rounded">Go To Homepage</Link>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStatetoProps = state => {
    return {};
}
export default withRouter(connect(mapStatetoProps, { activateNonAuthLayout })(PageNotFound));