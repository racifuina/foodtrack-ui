import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';

// Layout Before Login
const NonAuthLayoutContent = (props) => {
    return <React.Fragment>
        {props.children}
    </React.Fragment>
}

// Layout After Login
const AuthLayoutContent = (props) => {
    var pathname = window.location.pathname.replace('/', '');
    return <React.Fragment>
        <div className="page-container">
            <Sidebar />
            <div className={(pathname === 'blank') ? 'is_blank_page main-content' : 'main-content'} id="main_content_sec">
                <Header />
                <div className="main-content-inner">
                    {props.children}
                </div>
            </div>
        </div>
    </React.Fragment>
}

class Layout extends Component {
    render() {
        return (
            <React.Fragment>
                {this.props.layout.layoutType === 'Auth' ? <AuthLayoutContent {...this.props} /> : <NonAuthLayoutContent {...this.props} />}
            </React.Fragment>
        );
    }
}

const mapStatetoProps = state => {
    return {
        layout: state.Layout
    };
}

export default withRouter(connect(mapStatetoProps)(Layout));
