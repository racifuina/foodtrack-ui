import React from 'react';
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { Field } from 'formik';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import validarNit from '../helpers/validarNit';

export default function NitField({ disabled, name, autoComplete, className, value }) {
    return (
        <InputGroup>
            <Field
                type="text"
                maxLength={20}
                disabled={disabled}
                name={name}
                autoComplete={autoComplete}
                className={className}
                value={value}
            />
            <InputGroupAddon
                addonType="append"
                style={{ cursor: "pointer" }}
                onClick={() => {
                    if (!value) {
                        return;
                    }
                    if (!validarNit(value)) {
                        return toast.error(`No es un Nit valido`, { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 15000 });
                    }
            }}>
                <InputGroupText>
                    <FontAwesomeIcon
                        icon={faQuestionCircle}
                        color="primary"
                    />
                </InputGroupText>
            </InputGroupAddon>
        </InputGroup>
    )

}
