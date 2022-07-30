import React, { Fragment } from 'react';
import { FormGroup, Label } from 'reactstrap';
import { Field, ErrorMessage } from 'formik';

export default function FormTextField(props) {
    const name = props.name;
    const title = props.title || props.name;
    const touched = props.touched || {};
    const errors = props.errors || {};
    const type = props.type || "text";
    const as = props.as || "";
    const optionLabel = props.optionLabel || "";
    const options = props.options || [];
    const disabled = props.disabled || false;
    const primaryKey = props.primaryKey || name;
    return (
        <FormGroup>
            <Label for={`${name}`}>{title}</Label>
            {
                as === 'select' ? (
                    <Field
                        autoFocus={props.autoFocus}
                        type={type}
                        as={as}
                        name={`${name}`}
                        disabled={disabled}
                        autoComplete="off"
                        className={`form-control ${touched[name] && errors[name] ? "is-invalid" : ""}`}
                    >
                        <Fragment>
                            <option value=""></option>
                            {
                                options.map(item => {
                                    return <option key={item[primaryKey]} value={item[primaryKey]}>{`${item[optionLabel]}`}</option>
                                })
                            }
                        </Fragment>
                    </Field>
                ) : (
                    <Field
                        autoFocus={props.autoFocus}
                        type={type}
                        as={as}
                        disabled={disabled}
                        name={`${name}`}
                        autoComplete="off"
                        className={`form-control ${touched[name] && errors[name] ? "is-invalid" : ""}`}
                    />
                )
            }
            <ErrorMessage
                component="div"
                name={`${name}`}
                className="invalid-feedback"
            />
        </FormGroup>
    )
}
