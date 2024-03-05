import { RadioButton, RadioButtonProps } from "primereact/radiobutton";

interface InputRadioProps extends RadioButtonProps {
  /** The label for the element */
  label: string
  /** Whether this radio item is selected */
  checked: boolean
}

/**
 * 
 * @param props {@link InputRadioProps}
 * @returns A controlled radio element
 */
export default function InputRadio(props: InputRadioProps) {
  const { id, name, value, onChange, disabled, label, checked } = props
  return (
    <div className="flex align-items-center">
      <RadioButton
        inputId={id}
        name={name}
        value={value}
        disabled={disabled}
        onChange={(...args) => !disabled && onChange(...args)}
        checked={checked}
      />
      <label htmlFor={id} className="ml-2">
        {label}
      </label>
    </div>
  )
}
