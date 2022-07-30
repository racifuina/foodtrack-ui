import React, { Fragment } from 'react';
import { FormGroup, Label } from 'reactstrap';
import { ErrorMessage } from 'formik';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useFormikContext } from 'formik';

export default function TypeaheadField(props) {
    const { setFieldValue, values } = useFormikContext();
    const name = props.name;
    const title = props.title || props.name;
    const touched = props.touched || {};
    const errors = props.errors || {};
    const emptyLabel = props.emptyLabel || "No se encontraron resultados";
    const options = props.options || [];
    const disabled = props.disabled || false;
    const allowNew = props.allowNew || false;
    const valueKey = props.valueKey || name || '';
    const labelKey = props.labelKey || 'nombre';
    const filterBy = props.filterBy || [valueKey, labelKey];

    const selected = values[name] ? options.find(item => `${item[valueKey]}` === `${values[name]}`) ? [options.find(item => `${item[valueKey]}` === `${values[name]}`)] : [] : []
    const renderMenuItemChildren = props.renderMenuItemChildren || ((option) => {
        return (
            <div className="py-0">
                <b>{option[labelKey]}</b>
            </div>
        )
    });

    return (
        <FormGroup>
            <Label for={`${name}`}>{title}</Label>
            <Fragment>
                <Typeahead
                    id={`${name}`}
                    autoFocus={props.autoFocus}
                    name={`${name}`}
                    disabled={disabled}
                    valueKey={valueKey}
                    labelKey={labelKey}
                    filterBy={filterBy}
                    autoComplete="off"

                    emptyLabel={emptyLabel}
                    allowNew={allowNew}
                    options={options}
                    renderMenuItemChildren={renderMenuItemChildren}
                    isInvalid={touched[name] && errors[name]}
                    onChange={selected => {
                        if (selected.length > 0) {
                            setFieldValue(name, selected[0][name]);
                            if (props.onChange) props.onChange(selected[0]);
                        } else {
                            setFieldValue(name, '');
                            if (props.onChange) props.onChange('');
                        }
                    }}


                    selected={selected || []}
                />
                {
                    touched[name] && errors[name] ?
                        <small className="text-danger">{errors[name]}</small>
                        : null
                }
            </Fragment>
            <ErrorMessage
                component="div"
                name={`${name}`}
                className="invalid-feedback"
            />
        </FormGroup>
    )
}
