import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ValidarPermiso from '../helpers/ValidarPermiso';

//Metismenu
import MetisMenu from 'metismenujs';
import logo from "../assets/images/logo.png";

class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

        new MetisMenu("#menu", {});

        var matchingMenuItem = null;
        var ul = document.getElementById("menu");
        var items = ul.getElementsByTagName("a");
        for (var i = 0; i < items.length; ++i) {

            if (this.props.location.pathname === items[i].pathname) {
                matchingMenuItem = items[i];
                break;
            }
        }
        if (matchingMenuItem) {
            this.activateParentDropdown(matchingMenuItem);
        }
    }
    activateParentDropdown = (item) => {

        item.classList.add('mm-active');
        const parent = item.parentElement;

        if (parent) {
            parent.classList.add('mm-active'); // li 
            const parent2 = parent.parentElement;

            if (parent2) {
                parent2.classList.add("mm-show");
                const parent3 = parent2.parentElement;

                if (parent3) {
                    parent3.classList.add('mm-active'); // li
                    parent3.childNodes[0].classList.add('mm-active'); //a
                    const parent4 = parent3.parentElement;
                    if (parent4) {
                        parent4.classList.add('active');
                    }
                }
            }
            return false;
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="left side-menu">
                    <div className="sidebar-menu">
                        <div className="sidebar-header">
                            <div className="logo">
                                <a href="/dashboard">
                                    <img src={logo} alt="Logo" />
                                </a>
                            </div>
                        </div>
                        <div className="main-menu">
                            <div className="menu-inner" id="sidebar_menu">
                                <nav>
                                    <ul className="metismenu" id="menu">
                                        {
                                            ValidarPermiso(this.props.usuario, 'Gestion_Productos', 1) && (
                                                <li>
                                                    <Link to="/productos">
                                                        <i className="feather ft-grid"></i>
                                                        <span>Productos</span>
                                                    </Link>
                                                </li>
                                            )
                                        }
                                        <li>
                                            {
                                                (ValidarPermiso(this.props.usuario, 'Gestion_Empleados', 1) || ValidarPermiso(this.props.usuario, 'Gestion_Usuarios', 1) || ValidarPermiso(this.props.usuario, 'Gestion_Roles', 1)) && (
                                                    <Link to="/#">
                                                        <i className="feather ft-lock"></i>
                                                        <span>Seguridad</span>
                                                    </Link>
                                                )
                                            }
                                            <ul className="submenu">
                                                {
                                                    ValidarPermiso(this.props.usuario, 'Gestion_Usuarios', 1) && (
                                                        <li><Link to="/usuarios"><i className="feather ft-users"></i> <span>Usuarios</span></Link></li>
                                                    )
                                                }
                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    usuario: state.Login.usuario
});

export default withRouter(connect(mapStateToProps)(Sidebar));


// export default withRouter(Sidebar);