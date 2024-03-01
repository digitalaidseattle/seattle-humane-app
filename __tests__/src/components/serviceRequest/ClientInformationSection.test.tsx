import '@testing-library/jest-dom';
import { fireEvent, render, screen } from "@testing-library/react";
import { createContext, useReducer } from "react";
import ClientInformationSection, { clientInformationLabels as labels, previouslyUsedOptions } from "@components/serviceRequest/ClientInformationSection";
import { ClientInformationProvider, clientInfoReducer, defaultClientInformation } from "@context/serviceRequest/clientInformationContext";
import { EdiableClientInfo } from '@types';

//* Mocking the client information context to isolate the test
jest.mock('@context/serviceRequest/clientInformationContext', () => {
  const ClientInformationContext = createContext(null)
  const ClientInformationDispatchContext = createContext(null)
  //* Using type annotation here to force this test to break if the contract changes
  const defaultClientInformation: EdiableClientInfo = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    postal_code: '',
    previously_used: '',
  }
  return { 
    defaultClientInformation,
    ClientInformationContext,
    ClientInformationDispatchContext,
    ClientInformationProvider: ({ state, dispatch, children }) => (
      <ClientInformationContext.Provider value={state}>
      <ClientInformationDispatchContext.Provider value={dispatch}>
        {children}
      </ClientInformationDispatchContext.Provider>
    </ClientInformationContext.Provider>
    ),
    ClientInfoActionType: { Update: 'Update' },
    clientInfoReducer: jest.fn()
    .mockImplementation((state, action) => ({ ...state, ...action.partialStateUpdate }))
  }
})

afterEach(() => {
  // Clear the mock reducer call counts after each test
  jest.clearAllMocks()
})

/* 
* Intentionally not mocking the child components consumed (InputText, InputRadio)
* per react-testing-library guiding principles to not deal with components:
* https://testing-library.com/docs/guiding-principles
*/

describe('ClientInformationSection', () => {
  let firstNameInput = null
  let lastNameInput = null
  let emailInput = null
  let phoneNumberInput = null
  let postalCodeInput = null
  let previousyUsedRadioButtons = []
  let textInputs = []

  //* The Section requires a context, so wrap it in a context provider to test
  function ClientInfoSectionConsumer({ defaultState, disabled, fields }) {
    const [state, dispatch] = useReducer(clientInfoReducer, defaultState)
    return (
      <ClientInformationProvider state={state} dispatch={dispatch}>
        <ClientInformationSection disabled={disabled} show={fields} />
      </ClientInformationProvider>
    )
  }

  //* Renders the component and captures the elements for later assertions
  function setup({ defaultState = defaultClientInformation, fields = undefined, disabled = false } = {}) {
    render(<ClientInfoSectionConsumer defaultState={defaultState} disabled={disabled} fields={fields} />)
    firstNameInput = screen.queryByLabelText(labels.FirstName)
    lastNameInput = screen.queryByLabelText(labels.LastName)
    emailInput = screen.queryByLabelText(labels.Email)
    phoneNumberInput = screen.queryByLabelText(labels.PhoneNumber)
    postalCodeInput = screen.queryByLabelText(labels.PostalCode)
    // Putting all inputs in an array for more consice assertions via loops
    textInputs = [
      firstNameInput,
      lastNameInput,
      emailInput,
      phoneNumberInput,
      postalCodeInput
    ]
    previousyUsedRadioButtons = previouslyUsedOptions.map((val) => {
      return screen.queryByLabelText(val)
    })
  }

  it('should render an empty form showing all fields by default', () => {
    //* Arrange
    setup()
    //* Assert
    textInputs.forEach((field) => {
      expect(field).toBeInTheDocument()
      expect(field).toHaveDisplayValue('')
    })
    previousyUsedRadioButtons.forEach((item) => {
      expect(item).toBeInTheDocument()
      expect(item).not.toBeChecked()
    })
  })

  it('should hide fields not configured for visibility', () => {
    //* Arrange
    setup({ fields: [] })
    //* Assert
    textInputs.forEach((field) => {
      expect(field).not.toBeInTheDocument()
    })
    previousyUsedRadioButtons.forEach((item) => {
      expect(item).not.toBeInTheDocument()
    })
  })

  it('should disable controls when so configured', () => {
    //* Arrange
    setup({ disabled: true })
    //* Assert
    textInputs.forEach((field) => {
      expect(field).toBeDisabled()
    })
    previousyUsedRadioButtons.forEach((item) => {
      expect(item).toBeDisabled()
    })
  })

  it('should dispatch updates when text values are changed', () => {
    //* Arrange
    setup()
    //* Act
    const newValue = 'new value'
    textInputs.forEach((field, i) => {
      fireEvent.change(field, { target: { value: newValue + i } })
    })
    //* Assert
    textInputs.forEach((field, i) => {
      expect(clientInfoReducer).toHaveBeenNthCalledWith(i+1,
        expect.anything(),
        expect.objectContaining({
          type: 'Update',
          partialStateUpdate: { [field.id]: newValue + i }
        })
      )
    })
  })

  it.each(previouslyUsedOptions)('should dispatch updates when the %s radio option is selected', (label) => {
    //* Arrange
    setup()
    //* Act
    const radioButton = screen.queryByLabelText(label)
    fireEvent.click(radioButton)
    //* Assert
    expect(clientInfoReducer).toHaveBeenNthCalledWith(1,
      expect.anything(),
      expect.objectContaining({
        type: 'Update',
        partialStateUpdate: { 'previously_used': label }
      })
    )
  })
})