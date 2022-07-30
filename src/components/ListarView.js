import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom';
import { Card, CardBody, Button, Alert } from 'reactstrap';
import Loader from './Loader'
import Tabla from './Tabla'
import OpcionesCell from './OpcionesCell'
import RegresarButton from './RegresarButton'

class ListarView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            error: false,
            showDefaultOptions: props.showDefaultOptions === undefined ? true : props.showDefaultOptions,
            enableFilters: false,
            errorMessage: '',
            data: []
        }
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        this.setState(() => ({ data: [], loading: false }));
    }

    render() {
        return (
            <div className="pb-2" style={{ minHeight: 'calc(100vh - 155px)' }}>
                <div className="rt_subheader mb-2" >
                    <div className="rt_subheader_main">
                        <h3 className="rt_subheader_title mb-mob-2">{this.props.title}</h3>
                    </div>
                    <div className="subheader_btns">
                        {
                            !this.state.loading && this.state.data.length > 0 &&
                            <Button
                                className="mr-2"
                                color={this.state.enableFilters ? "danger" : "outline-success"}
                                onClick={() => this.setState((state) => ({ enableFilters: !state.enableFilters }))}
                            >
                                <i className="feather ft-filter" /><span>Filtro</span>
                            </Button>
                        }
                        {
                            this.props.hideCreateButton !== true && (
                                <Link
                                    className="btn btn-outline-primary"
                                    to={`${this.props.match.url}/crear`}
                                >
                                    <i className="feather ft-plus" />
                                    <span>{this.props.newItemButtonText || "Crear"}</span>
                                </Link>
                            )
                        }
                        {
                            this.props.showBackButton && (
                                <RegresarButton className="ml-1"/>
                            )
                        }
                    </div>
                </div>
                <Card>
                    <CardBody>
                        {
                            this.state.loading ?
                                <Loader /> :
                                this.state.error ?
                                    <Alert color="danger">
                                        <span>{this.state.errorMessage}</span>
                                    </Alert>
                                    :
                                    <Tabla
                                        filterable={this.state.enableFilters}
                                        columns={this.state.showDefaultOptions ? this.props.columns.concat({
                                            Header: 'Opciones',
                                            accessor: this.props.primaryKey,
                                            path: this.props.match.url,
                                            filterable: false,
                                            sortable: false,
                                            Cell: (cellProps) => {
                                                return <OpcionesCell {...cellProps} onDeleteCallback={() => {
                                                    this.setState(state => {
                                                        const data = state.data.filter(e => e[this.props.primaryKey] !== cellProps.original[this.props.primaryKey])
                                                        return { data }
                                                    })
                                                }} />
                                            }

                                        }) : this.props.columns}
                                        data={this.state.data}
                                    />
                        }
                    </CardBody>
                </Card>
            </div>

        )
    }
}

export default withRouter(ListarView);