import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Row } from 'reactstrap';
import { connect } from 'react-redux';
import mobile_logo from "../assets/images/mobile-logo.png";
import user from "../assets/images/user.png";

class Topbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            create_menu: false,
            toggle: false,
            menu: false,
            notificationMenu: false,
            messagesMenu: false,
        };
        this.toggleCreate = this.toggleCreate.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleNotification = this.toggleNotification.bind(this);
        this.toggleMessages = this.toggleMessages.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            menu: !prevState.menu
        }));
    }

    toggleNotification() {
        this.setState(prevState => ({
            notificationMenu: !prevState.notificationMenu
        }));
    }

    toggleMessages() {
        this.setState(prevState => ({
            messagesMenu: !prevState.messagesMenu
        }));
    }

    toggleCreate() {
        this.setState(prevState => ({
            create_menu: !prevState.create_menu
        }));
    }

    sidebarToggle = () => {
        const pageClass = document.querySelector('.page-container');
        pageClass.classList.toggle('sidebar_collapsed');
    }

    toggleFullscreen() {
        if (!document.fullscreenElement && /* alternative standard method */ !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="header-area">
                    <Row className="align-items-center">
                        <div className="mobile-logo d_none_lg">
                            <Link to="dashboard"><img src={mobile_logo} alt="logo" /></Link>
                        </div>

                        <div className="col-md-6 d_none_sm d-flex align-items-center">
                            <div className="nav-btn pull-left" onClick={this.sidebarToggle}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-12">
                            <ul className="notification-area pull-right">
                                <li>
                                    <span className="nav-btn pull-left d_none_lg" onClick={this.sidebarToggle}>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </span>
                                </li>
                                <li id="full-view" className="d_none_sm" onClick={this.toggleFullscreen}><i className="feather ft-maximize"></i></li>

                                <li className="user-dropdown">
                                    <Dropdown isOpen={this.state.menu} toggle={this.toggle} tag="div" >
                                        <DropdownToggle className="btn dropdown-toggle" tag="div">
                                            <span className="d_none_sm">{this.props.usuario.nombre} <i className="ti-angle-down"></i></span>
                                            <img src={user} alt="" className="img-fluid" />
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu">
                                            {/* <DropdownItem tag="a" href="#"><i className="ti-user"></i> Profile</DropdownItem> 
                                            <span role="separator" className="divider"></span>*/}
                                            <DropdownItem tag="a" className="text-danger" href="/logout"><i className="ti-power-off"></i>Cerrar Sesión</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </li>
                            </ul>
                        </div>
                    </Row>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    usuario: state.Login.usuario
});


export default connect(mapStateToProps)(Topbar);



