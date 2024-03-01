import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import InputText from "@components/InputText";
import { useState } from 'react';

describe('InputText', () => {
  const fakeId = 'fake-id'
  const labelText = 'fake-label'
  const defaultValue = 'fake-value'
  const newValue = 'new value'
  const placeholder = 'fake-placeholder'

  it('should render a text input with the provided value prop', () => {
    //* Arrange
    render(<InputText
      id={fakeId}
      value={defaultValue}
      label={labelText}
    />)
    const labelElement = screen.getByText(labelText)
    const textElement = screen.getByLabelText(labelText)
    const component = textElement.parentElement
    //* Assert
    expect(labelElement).toBeInTheDocument()
    expect(textElement).toBeInTheDocument()
    expect(textElement).toHaveDisplayValue(defaultValue)
    // Snapshot added for friction when changing markup/classes/styles
    expect(component).toMatchSnapshot()
  })

  it('should initially render a text input with empty string', () => {
    //* Arrange
    render(<InputText
      id={fakeId}
      value=''
      label={labelText}
    />)
    const labelElement = screen.getByText(labelText)
    const textElement = screen.getByLabelText(labelText)
    //* Assert
    expect(labelElement).toBeInTheDocument()
    expect(textElement).toBeInTheDocument()
    expect(textElement).toHaveDisplayValue('')
  })

  it('should render a text input with placeholder text', () => {
    //* Arrange
    render(<InputText
      id={fakeId}
      value=''
      label={labelText}
      placeholder={placeholder}
    />)
    const labelElement = screen.getByText(labelText)
    const textElement = screen.getByPlaceholderText(placeholder)
    //* Assert
    expect(labelElement).toBeInTheDocument()
    expect(textElement).toBeInTheDocument()
  })

  it('should call onChange with the target element when the value is changed', () => {
    //* Arrange
    const onChangeProp = jest.fn()
    render(<InputText
      id={fakeId}
      value={defaultValue}
      label={labelText}
      onChange={onChangeProp}
    />)
    //* Act
    let inputText = screen.getByLabelText(labelText)
    fireEvent.change(inputText, { target: { value: newValue } })
    //* Assert
    expect(onChangeProp).toHaveBeenCalledWith(
      expect.objectContaining({
        target: inputText
      })
    )
    /* 
    *  Note, this test is designed only to assert propsOnChange
    *  is called with the target element.
    *  This test does not make assumptions about whether 
    *  the input value is actually changed, since that is the
    *  business of the propsOnChange. 
    *  Ex: propsOnChange determined that the input 
    *  was invalid and did not allow the change.
    *  Also, testing other aspects of the change event is out of scope.
    */
  })

  it('should not call onChange when disabled', () => {
    //* Arrange
    const onChangeProp = jest.fn()
    render(<InputText
      id={fakeId}
      value=''
      disabled={true}
      label={labelText}
      onChange={onChangeProp}
    />)
    //* Act
    let inputText = screen.getByLabelText(labelText)
    fireEvent.change(inputText, { target: { value: newValue } })
    //* Assert
    expect(onChangeProp).not.toHaveBeenCalled()
  })

  it('should update as expected when consumed by a stateful component', () => {
    //* Arrange
    function MockComponent() {
      const [value, setValue] = useState('')
      return <InputText
        id={fakeId}
        value={value}
        label={labelText}
        onChange={(e) => setValue(e.target.value)}
      />
    }
    render(<MockComponent />)
    //* Act
    let inputText = screen.getByLabelText(labelText)
    fireEvent.change(inputText, { target: { value: newValue } })
    //* Assert
    expect(inputText).toHaveDisplayValue(newValue)
  })
})