import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { createContext, useReducer } from 'react';
import ServiceInformationSection, {
  serviceInformationLabels as labels,
  statusOptions,
  sourceOptions,
  priorityOptions,
} from '@components/serviceRequest/ServiceInformationSection';
import {
  ServiceInformationProvider,
  serviceInfoReducer,
  defaultServiceInformation,
} from '@context/serviceRequest/serviceInformationContext';
import { ServiceRequestSchemaInsert } from '@types';

//* Mocking the service information context module to isolate the test
jest.mock('@context/serviceRequest/serviceInformationContext', () => {
  const ServiceInformationContext = createContext(null);
  const ServiceInformationDispatchContext = createContext(null);
  //* Using type annotation here to force this test to break if the contract changes
  const defaultServiceInformation: ServiceRequestSchemaInsert = {
    service_category: '',
    priority: '',
    source: '',
    description: '',
    status: '',
    assigned_to: '',
  };
  return {
    defaultServiceInformation,
    ServiceInformationContext,
    ServiceInformationDispatchContext,
    ServiceInformationProvider: ({ state, dispatch, children }) => (
      <ServiceInformationContext.Provider value={state}>
        <ServiceInformationDispatchContext.Provider value={dispatch}>
          {children}
        </ServiceInformationDispatchContext.Provider>
      </ServiceInformationContext.Provider>
    ),
    ServiceInfoActionType: { Update: 'Update' },
    serviceInfoReducer: jest.fn()
      .mockImplementation((state, action) => ({ ...state, ...action.partialStateUpdate })),
  };
});

//* Mocking the client service module to isolate the test
jest.mock('src/services/ClientService', () => ({
  TicketType: {
    email: 'email',
    phone: 'phone',
    walkin: 'walk-in',
  },
}));

afterEach(() => {
  // Clear the mock reducer call counts after each test
  jest.clearAllMocks();
});

/*
* Intentionally not mocking the child components consumed (InputText, InputRadio)
* per react-testing-library guiding principles to not deal with components:
* https://testing-library.com/docs/guiding-principles
*/

describe('ServiceInformationSection', () => {
  let textInputs = [];
  /*
  * Need to keep track of each radio button beside its field key, label & value.
  * The label is used to query the DOM for the element.
  * The field key and value are used to assert the action is dispatched with the right data.
  * */
  let radioButtons: [HTMLElement, keyof ServiceRequestSchemaInsert, string, string][] = [];

  //* The Section requires a context, so wrap it in a context provider to test
  function PetInfoSectionConsumer({ defaultState, disabled, fields }) {
    const [state, dispatch] = useReducer(serviceInfoReducer, defaultState);
    return (
      <ServiceInformationProvider state={state} dispatch={dispatch}>
        <ServiceInformationSection disabled={disabled} show={fields} />
      </ServiceInformationProvider>
    );
  }

  //* Renders the component and captures the elements for later assertions
  function setup({ defaultState = defaultServiceInformation, fields = undefined, disabled = false } = {}) {
    render(<PetInfoSectionConsumer defaultState={defaultState} disabled={disabled} fields={fields} />);
    // Putting all inputs in an array for more consice assertions via loops
    textInputs = [
      screen.queryByLabelText(labels.Category),
      screen.queryByLabelText(labels.ServiceDescription),
      screen.queryByLabelText(labels.AssignTo),
    ];
    radioButtons = [];
    statusOptions.forEach((label) => {
      const radioButton = screen.queryByLabelText(label);
      radioButtons.push([radioButton, 'status', label, label]);
    });
    priorityOptions.forEach((label) => {
      const radioButton = screen.queryByLabelText(label);
      radioButtons.push([radioButton, 'priority', label, label]);
    });
    Object.keys(sourceOptions).map((label) => {
      const radioButton = screen.queryByLabelText(label);
      radioButtons.push([radioButton, 'source', label, sourceOptions[label]]);
    });
  }

  it('should render an empty form showing all fields by default', () => {
    //* Arrange
    setup();
    //* Assert
    textInputs.forEach((field) => {
      expect(field).toBeInTheDocument();
      expect(field).toHaveDisplayValue('');
    });
    radioButtons.forEach(([radioButton]) => {
      expect(radioButton).toBeInTheDocument();
      expect(radioButton).not.toBeChecked();
    });
  });

  it('should hide fields not configured for visibility', () => {
    //* Arrange
    setup({ fields: [] });
    //* Assert
    textInputs.forEach((field) => {
      expect(field).not.toBeInTheDocument();
    });
    radioButtons.forEach(([radioButton]) => {
      expect(radioButton).not.toBeInTheDocument();
    });
  });

  it('should disable controls when so configured', () => {
    //* Arrange
    setup({ disabled: true });
    //* Assert
    textInputs.forEach((field) => {
      expect(field).toBeDisabled();
    });
    radioButtons.forEach(([radioButton]) => {
      expect(radioButton).toBeDisabled();
    });
  });

  it('should dispatch updates when text values are changed', () => {
    //* Arrange
    setup();
    //* Act
    const newValue = 'new value';
    textInputs.forEach((field, i) => {
      fireEvent.change(field, { target: { value: newValue + i } });
    });
    //* Assert
    textInputs.forEach((field, i) => {
      expect(serviceInfoReducer).toHaveBeenNthCalledWith(
        i + 1,
        expect.anything(), // We are only concerned with the action, not the previous state
        expect.objectContaining({
          type: 'Update',
          partialStateUpdate: { [field.id]: newValue + i },
        }),
      );
    });
  });

  it('should dispatch updates when radio values are changed', () => {
    //* Arrange
    setup();
    //* Act
    radioButtons.forEach(([radioButton]) => {
      fireEvent.click(radioButton);
    });
    //* Assert
    radioButtons.forEach(([radioButton, key, label, value], i) => {
      expect(serviceInfoReducer).toHaveBeenNthCalledWith(
        i + 1,
        expect.anything(), // We are only concerned with the action, not the previous state
        expect.objectContaining({
          type: 'Update',
          partialStateUpdate: { [key]: value },
        }),
      );
    });
  });
});
