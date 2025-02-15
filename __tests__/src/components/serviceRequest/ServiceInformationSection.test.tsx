import '@testing-library/jest-dom';
import {
  fireEvent, render, screen, within,
} from '@testing-library/react';
import { createContext, useReducer } from 'react';
import ServiceInformationSection, {
  serviceInformationLabels as labels,
} from '@components/serviceRequest/ServiceInformationSection';
import {
  ServiceInformationProvider,
  serviceInfoReducer,
  defaultServiceInformation,
} from '@context/serviceRequest/serviceInformationContext';
import { EditableServiceRequestType } from '@types';
import { mockTeamMember2 } from '@utils/TestData';
import { MockAppConstants } from '@hooks/__mocks__/useAppConstants';

const { source } = MockAppConstants;

//* Mocking the service information context module to isolate the test
jest.mock('@context/serviceRequest/serviceInformationContext', () => {
  const ServiceInformationContext = createContext(null);
  const ServiceInformationDispatchContext = createContext(null);
  //* Using type annotation here to force this test to break if the contract changes
  const testDefaultServiceInformation: EditableServiceRequestType = {
    client_id: '',
    pet_id: '',
    service_category: '',
    request_source: '',
    status: '',
    description: '',
    team_member_id: '',
    urgent: false,
    modified_at: '',
  };
  return {
    defaultServiceInformation: testDefaultServiceInformation,
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
      .mockImplementation((state, action) => ([{ ...state, ...action.partialStateUpdate }])),
  };
});

jest.mock('src/hooks/useAppConstants');
jest.mock('src/hooks/useTeamMembers');

afterEach(() => {
  // Clear the mock reducer call counts after each test
  jest.clearAllMocks();
});

/*
* Intentionally not mocking the child components consumed (InputText, InputRadio)
* per react-testing-library guiding principles to not deal with components:
* https://testing-library.com/docs/guiding-principles
*/

describe.skip('ServiceInformationSection', () => {
  let textInputs = [];
  /*
  * Need to keep track of each radio button beside its field key, label & value.
  * The label is used to query the DOM for the element.
  * The field key and value are used to assert the action is dispatched with the right data.
  * */
  let radioButtons: [HTMLElement, keyof EditableServiceRequestType, string, string][] = [];
  let dropdowns = [];

  //* The Section requires a context, so wrap it in a context provider to test
  function ServiceInfoSectionConsumer({ defaultState, disabled, show }) {
    const [state, dispatch] = useReducer(serviceInfoReducer, defaultState);
    return (
      <ServiceInformationProvider state={state} dispatch={dispatch}>
        <ServiceInformationSection disabled={disabled} show={show} />
      </ServiceInformationProvider>
    );
  }

  //* Renders the component and captures the elements for later assertions
  function setup({
    defaultState = [defaultServiceInformation],
    show = undefined,
    disabled = false,
  } = {}) {
    render(<ServiceInfoSectionConsumer
      defaultState={defaultState}
      disabled={disabled}
      show={show}
    />);
    // Putting all inputs in an array for more consice assertions via loops
    textInputs = [
      screen.queryByLabelText(labels.ServiceDescription),
    ];

    radioButtons = [];
    source.forEach((opt) => {
      const radioButton = screen.queryByLabelText(opt.label);
      radioButtons.push([radioButton, 'request_source', opt.label, opt.id]);
    });

    dropdowns = [screen.queryByTitle(labels.Category)];
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
    dropdowns.forEach((dropdown) => {
      expect(dropdown).toBeInTheDocument();
    });
  });

  it('should hide fields not configured for visibility', () => {
    //* Arrange
    setup({ show: [] });
    //* Assert
    textInputs.forEach((field) => {
      expect(field).not.toBeInTheDocument();
    });
    radioButtons.forEach(([radioButton]) => {
      expect(radioButton).not.toBeInTheDocument();
    });
    dropdowns.forEach((dropdown) => {
      expect(dropdown).not.toBeInTheDocument();
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
    dropdowns.forEach((dropdown) => {
      expect(dropdown).toHaveClass('p-disabled');
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
    radioButtons.forEach(([, key, , value], i) => {
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

  it('should dispatch updates when dropdown values are changed', () => {
    //* Arrange
    setup();
    //* Act
    return Promise.all(dropdowns.map(async (dropdown) => {
      fireEvent.click(
        within(dropdown).getByRole('button'),
      );
      fireEvent.click(await screen.getByLabelText('Pet Fostering'));
      expect(screen.getByDisplayValue('Pet Fostering')).toBeInTheDocument();
    }));
  });

  it('should load the list of team members', async () => {
    //* Arrange
    setup();
    const assignToDropdown = screen.queryByTitle(labels.AssignTo);

    //* Act
    fireEvent.click(
      within(assignToDropdown).getByRole('button'),
    );
    fireEvent.click(await screen.findByText(mockTeamMember2.email));

    //* Assert
    expect(screen.getByDisplayValue(mockTeamMember2.email)).toBeInTheDocument();
  });
});
