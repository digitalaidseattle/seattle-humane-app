import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import InputRadio from "@components/InputRadio";
import { useEffect, useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';

describe('InputRadio', () => {
  const fakeId = 'fake-id'
  const labelText = 'fake-label'
  const fakeValue = 'fake-value'

  it.each([['unchecked', false], ['checked', true]])('should render a %s radio button when the checked prop is %s', (label, defaultChecked) => {
    //* Arrange
    render(<InputRadio
      id={fakeId}
      checked={defaultChecked}
      label={labelText}
      value={fakeValue}
    />)
    const labelElement = screen.getByText(labelText)
    const radioButton = screen.getByLabelText(labelText)
    const component = radioButton.parentElement
    //* Assert
    expect(labelElement).toBeInTheDocument()
    expect(radioButton).toBeInTheDocument()

    if (defaultChecked) expect(radioButton).toBeChecked()
    else expect(radioButton).not.toBeChecked()

    // Snapshot added for friction when changing markup/classes/styles
    expect(component).toMatchSnapshot()
  })

  it('should call onChange with the target element and value when the radio is checked', () => {
    //* Arrange
    const onChangeProp = jest.fn()
    render(<InputRadio
      id={fakeId}
      checked={false}
      label={labelText}
      value={fakeValue}
      onChange={onChangeProp}
    />)
    //* Act
    const radioButton = screen.getByLabelText(labelText)
    fireEvent.click(radioButton)
    //* Assert
    expect(onChangeProp).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ checked: true, value: fakeValue })
      })
    )
  })

  it('should not call onChange when disabled', () => {
    //* Arrange
    const onChangeProp = jest.fn()
    render(<InputRadio
      id={fakeId}
      checked={false}
      value={fakeValue}
      disabled={true}
      label={labelText}
      onChange={onChangeProp}
    />)
    //* Act
    const radioButton = screen.getByLabelText(labelText)
    fireEvent.click(radioButton)
    //* Assert
    expect(onChangeProp).not.toHaveBeenCalled()
  })

  it('should update as expected when consumed by a stateful component', () => {
    //* Arrange
    function MockComponent() {
      const [value, setValue] = useState('val1')
      return <>
        <InputRadio
          id={fakeId + '_1'}
          checked={value === 'val1'}
          label={labelText + '_1'}
          value={'val1'}
          onChange={(e) => setValue(e.value)}
        />
        <InputRadio
          id={fakeId + '_2'}
          checked={value === 'val2'}
          label={labelText + '_2'}
          value={'val2'}
          onChange={(e) => setValue(e.value)}
        />
      </>
    }
    render(<MockComponent />)
    const radioButton1 = screen.getByLabelText(labelText + '_1')
    expect(radioButton1).toHaveAttribute('checked')
    const radioButton2 = screen.getByLabelText(labelText + '_2')
    //* Act
    fireEvent.click(radioButton2)
    //* Assert
    expect(radioButton1).not.toHaveAttribute('checked')
    expect(radioButton2).toHaveAttribute('checked')
  })
})