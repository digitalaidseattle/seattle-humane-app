import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { createContext, useReducer } from 'react';
import PetInformationSection, { petInformationLabels as labels } from '@components/serviceRequest/PetInformationSection';
import { PetInformationProvider, petInfoReducer, defaultPetInformation } from '@context/serviceRequest/petInformationContext';
import { EditableAnimalType } from '@types';
import { data } from 'src/hooks/__mocks__/useAppConstants';

const { species } = data;
//* Mocking the pet information context module to isolate the test
jest.mock('@context/serviceRequest/petInformationContext', () => {
  const PetInformationContext = createContext(null);
  const PetInformationDispatchContext = createContext(null);
  //* Using type annotation here to force this test to break if the contract changes
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const defaultPetInformation: EditableAnimalType = {
    name: '',
    species_id: '',
    age: 0,
    weight: 0,
  };
  return {
    defaultPetInformation,
    PetInformationContext,
    PetInformationDispatchContext,
    PetInformationProvider: ({ state, dispatch, children }) => (
      <PetInformationContext.Provider value={state}>
        <PetInformationDispatchContext.Provider value={dispatch}>
          {children}
        </PetInformationDispatchContext.Provider>
      </PetInformationContext.Provider>
    ),
    PetInfoActionType: { Update: 'Update' },
    petInfoReducer: jest.fn()
      .mockImplementation((state, action) => ({ ...state, ...action.partialStateUpdate })),
  };
});

jest.mock('src/hooks/useAppConstants');

afterEach(() => {
  // Clear the mock reducer call counts after each test
  jest.clearAllMocks();
});

/*
* Intentionally not mocking the child components consumed (InputText, InputRadio)
* per react-testing-library guiding principles to not deal with components:
* https://testing-library.com/docs/guiding-principles
*/

describe('PetInformationSection', () => {
  let nameInput = null;
  let ageInput = null;
  let weightInput = null;
  let textInputs = [];

  //* The Section requires a context, so wrap it in a context provider to test
  function PetInfoSectionConsumer({ defaultState, disabled, fields }) {
    const [state, dispatch] = useReducer(petInfoReducer, defaultState);
    return (
      <PetInformationProvider state={state} dispatch={dispatch}>
        <PetInformationSection disabled={disabled} show={fields} />
      </PetInformationProvider>
    );
  }

  //* Renders the component and captures the elements for later assertions
  function setup({
    defaultState = defaultPetInformation,
    fields = undefined,
    disabled = false,
  } = {}) {
    render(<PetInfoSectionConsumer
      defaultState={defaultState}
      disabled={disabled}
      fields={fields}
    />);
    nameInput = screen.queryByLabelText(labels.Name);
    ageInput = screen.queryByLabelText(labels.Age);
    weightInput = screen.queryByLabelText(labels.Weight);
    // Putting all inputs in an array for more consice assertions via loops
    textInputs = [
      nameInput,
      ageInput,
      weightInput,
    ];
    // speciesRadioButtons = speciesOptions.map((val) => screen.queryByLabelText(val));
  }

  it('should render an empty form showing all fields by default', () => {
    //* Arrange
    setup();
    //* Assert
    textInputs.forEach((field) => {
      expect(field).toBeInTheDocument();
      expect(field).toHaveValue(defaultPetInformation[field.id]);
    });
    species.map((opt) => screen.queryByLabelText(opt.label))
      .forEach((item) => {
        expect(item).toBeInTheDocument();
        expect(item).not.toBeChecked();
      });
  });

  it('should hide fields not configured for visibility', () => {
    //* Arrange
    setup({ fields: [] });
    //* Assert
    textInputs.forEach((field) => {
      expect(field).not.toBeInTheDocument();
    });
    species.map((opt) => screen.queryByLabelText(opt.label))
      .forEach((item) => {
        expect(item).not.toBeInTheDocument();
      });
  });

  it('should disable controls when so configured', () => {
    //* Arrange
    setup({ disabled: true });
    //* Assert
    textInputs.forEach((field) => {
      expect(field).toBeDisabled();
    });
    species.map((opt) => screen.queryByLabelText(opt.label))
      .forEach((item) => {
        expect(item).toBeDisabled();
      });
  });

  it('should dispatch updates when text values are changed', () => {
    //* Arrange
    setup();
    //* Act
    textInputs.forEach((field, i) => {
      fireEvent.change(field, { target: { value: defaultPetInformation[field.id] + i } });
    });
    //* Assert
    textInputs.forEach((field, i) => {
      expect(petInfoReducer).toHaveBeenNthCalledWith(
        i + 1,
        expect.anything(), // We are only concerned with the action, not the previous state
        expect.objectContaining({
          type: 'Update',
          partialStateUpdate: { [field.id]: defaultPetInformation[field.id] + i },
        }),
      );
    });
  });

  it.each(species.map((opt) => [opt.label, opt]))('should dispatch updates when the %s radio option is selected', (label, opt) => {
    //* Arrange
    setup();
    //* Act
    const radioButton = screen.queryByLabelText(opt.label);
    fireEvent.click(radioButton);
    //* Assert
    expect(petInfoReducer).toHaveBeenNthCalledWith(
      1,
      expect.anything(), // We are only concerned with the action, not the previous state
      expect.objectContaining({
        type: 'Update',
        partialStateUpdate: { species_id: opt.value },
      }),
    );
  });
});
