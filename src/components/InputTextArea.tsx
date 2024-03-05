import { InputTextareaProps as PrimeReactInputTextareaProps, InputTextarea as PrimeReactInputTextArea } from "primereact/inputtextarea";

/** The properties for the InputText component */
export interface SHInputTextAreaProps extends PrimeReactInputTextareaProps {
  /** The label for the element */
  label: string
}

/**
 * 
 * @param props {@link SHInputTextAreaProps}
 * @returns A controlled input element
 */
export default function InputText(props: SHInputTextAreaProps) {
  const { id, value, onChange, disabled, label, placeholder } = props
  return (
    <>
      <div className="mb-2"><label htmlFor={id}>
        {label}
      </label></div>
      <div>
        <PrimeReactInputTextArea
          id={id}
          className="w-full"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(...args) => !disabled && onChange(...args)}
        />
      </div>
    </>
  )
}
