import { InputTextProps as PrimeReactInputTextProps, InputText as PrimeReactInputText } from 'primereact/inputtext';

/** The properties for the InputText component */
export interface InputTextProps extends PrimeReactInputTextProps {
  /** The label for the element */
  label: string
}

/**
 *
 * @param props {@link SHInputTextProps}
 * @returns A controlled input element
 */
export default function InputText(props: InputTextProps) {
  const {
    id, value, type, onChange, disabled, label, placeholder,
  } = props;
  return (
    <div className="flex flex-column gap-2">
      <label htmlFor={id}>
        {label}
      </label>
      <PrimeReactInputText
        id={id}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        type={type}
        onChange={(...args) => !disabled && onChange(...args)}
      />
    </div>
  );
}
