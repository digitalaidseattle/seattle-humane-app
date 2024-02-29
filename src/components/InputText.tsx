import { InputTextProps as PrimeReactInputTextProps, InputText as PrimeReactInputText } from "primereact/inputtext";

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
  const { id, value, onChange, disabled, label, placeholder } = props
  const type = props.type ?? 'text'
  return (
    <>
      <div className="mb-2"><label htmlFor={id}>
        {label}
      </label></div>
      <div>
        <PrimeReactInputText
          id={id}
          className="w-full"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          type={type}
          onChange={(...args) => !disabled && onChange(...args)}
        />
      </div>
    </>
  )
}
