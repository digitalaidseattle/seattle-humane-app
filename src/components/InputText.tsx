import {
  InputTextProps as PrimeReactInputTextProps,
  InputText as PrimeReactInputText,
} from "primereact/inputtext";
import {
  InputMaskProps as PrimeReactInputMaskProps,
  InputMask as PrimeReactInputMask,
} from "primereact/inputmask";
import { ReactNode } from "react";

/** The properties for the InputText component */
export interface InputTextProps extends PrimeReactInputTextProps {
  /** The label for the element */
  label: string;
  helpText?: ReactNode;
  invalid?: boolean;
}
export interface InputMaskProps extends PrimeReactInputMaskProps {
  label: string;
  invalid?: boolean;
}

/**
 *
 * @param props {@link SHInputTextProps}
 * @returns A controlled input element
 */
export default function InputText(props: InputTextProps) {
  const {
    id,
    value,
    type,
    onChange,
    disabled,
    label,
    placeholder,
    onBlur,
    helpText,
    onFocus,
    invalid,
    keyfilter,
    maxLength,
  } = props;
  return (
    <div className='flex flex-column gap-2'>
      <label htmlFor={id} className={invalid && "p-error"}>
        {label}
      </label>
      <PrimeReactInputText
        id={id}
        className={invalid && "p-invalid"}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        type={type}
        onChange={(...args) => !disabled && onChange(...args)}
        aria-describedby='help-text'
        onBlur={onBlur}
        onFocus={onFocus}
        keyfilter={keyfilter}
        maxLength={maxLength}
      />
      <small id='help-text' className={invalid && "p-error"}>
        {helpText}
      </small>
    </div>
  );
}
export function InputMask(props: InputMaskProps) {
  const {
    id,
    value,
    type,
    onChange,
    disabled,
    label,
    placeholder,
    mask,
    invalid,
    onBlur,
  } = props;
  return (
    <div className='flex flex-column gap-2'>
      <label htmlFor={id} className={invalid && "p-error"}>
        {label}
      </label>
      <PrimeReactInputMask
        id={id}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        type={type}
        mask={mask}
        onBlur={onBlur}
        onChange={(...args) => !disabled && onChange(...args)}
        className={invalid && "p-invalid"}
        autoClear={false}
      />
    </div>
  );
}
