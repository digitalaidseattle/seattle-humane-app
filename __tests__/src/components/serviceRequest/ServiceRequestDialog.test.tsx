import { clientInformationLabels } from '@components/serviceRequest/ClientInformationSection';
import { petInformationLabels } from '@components/serviceRequest/PetInformationSection';
import { serviceInformationLabels } from '@components/serviceRequest/ServiceInformationSection';
import ServiceRequestDialog from '@components/serviceRequest/ServiceRequestDialog';
import { defaultServiceInformation } from '@context/serviceRequest/serviceInformationContext';
import useTicketById from '@hooks/useTicketById';
import '@testing-library/jest-dom';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockClient, mockPet, mockTicket } from '@utils/TestData';
import { useState } from 'react';
import * as DataService from '@services/DataService';

jest.mock('@services/DataService');
const mockedDataService = jest.mocked(DataService);

jest.mock('src/hooks/useTicketById');
const mockUseTicketById = jest.mocked(useTicketById);
jest.mock('src/hooks/useAppConstants');
jest.mock('src/hooks/useTeamMembers');

const SaveCancelLabels = {
  Save: 'Save', Cancel: 'Cancel',
};

const labelsOfFormFieldsToTest = [
  clientInformationLabels.FirstName,
  clientInformationLabels.LastName,
  petInformationLabels.Name,
  serviceInformationLabels.ServiceDescription,
];
const testId = 'serviceRequestDialog';
describe('ServiceRequestDialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockOnClose = jest.fn();
  function PageComponent({ showOnOpen, ticketId }) {
    const [visible, setVisible] = useState(showOnOpen);
    mockOnClose.mockImplementation(() => setVisible(false));
    return <ServiceRequestDialog ticketId={ticketId} visible={visible} onClose={mockOnClose} />;
  }

  function setup(showOnOpen = false, ticketId = null) {
    render(
      <PageComponent showOnOpen={showOnOpen} ticketId={ticketId} />,
    );
  }

  it('should be hidden when props.visible is false', () => {
    //* Arrange
    setup();
    //* Assert
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  it('should be shown when props.visible is true', () => {
    //* Arrange
    setup(true);
    //* Assert
    expect(screen.queryByTestId(testId)).toBeInTheDocument();
  });

  it('should call props.onClose when cancel is pressed', () => {
    //* Arrange
    setup(true);
    //* Act
    fireEvent.click(screen.queryByLabelText(SaveCancelLabels.Cancel));
    //* Assert
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should create new ticket when save is pressed, looking up existing owners and pets,', async () => {
    //* Arrange
    setup(true);

    //* Act
    // Type the client email
    await userEvent.type(
      screen.queryByLabelText(clientInformationLabels.Email),
      mockClient.email,
    );
    // Type the pet name
    await userEvent.type(
      screen.queryByLabelText(petInformationLabels.Name),
      mockPet.name,
    );
    // Type the ticket description
    await userEvent.type(
      screen.queryByLabelText(serviceInformationLabels.ServiceDescription),
      mockTicket.description,
    );
    fireEvent.click(screen.queryByLabelText(SaveCancelLabels.Save));
    await waitFor(() => expect(mockedDataService.createTicket)
      .toHaveBeenCalledTimes(1));

    //* Assert
    expect(mockedDataService.getClientByIdOrEmail)
      .toHaveBeenNthCalledWith(1, 'email', mockClient.email);
    expect(mockedDataService.getPetByOwner)
      .toHaveBeenNthCalledWith(1, mockClient.id, mockPet.name);
    expect(mockedDataService.createTicket).toHaveBeenNthCalledWith(
      1,
      { ...defaultServiceInformation, description: mockTicket.description },
      mockClient.id,
      mockPet.id,
    );
  });

  it('should disable the form while saving', async () => {
    //* Arrange
    // Capture resolve to "pause" the promise and check that fields are disabled
    let resolve;
    mockedDataService.createTicket
      .mockImplementation(async () => new Promise((r) => { resolve = r; }));
    setup(true);

    //* Act
    fireEvent.click(screen.queryByLabelText(SaveCancelLabels.Save));
    await waitFor(() => expect(mockedDataService.createTicket).toHaveBeenCalledTimes(1));

    //* Assert
    // Use the async method findBy* instead of queryBy* to allow for async state updates
    await Promise.all(labelsOfFormFieldsToTest.map(async (label) => {
      const field = await screen.findByLabelText(label);
      expect(field).toBeDisabled();
    }));
    // Simulate service call completion
    await waitFor(() => resolve());
    await Promise.all(labelsOfFormFieldsToTest.map(async (label) => {
      const field = await screen.findByLabelText(label);
      expect(field).toBeEnabled();
    }));
  });

  it('should debounce calls to save', async () => {
    /*
      * Note the FormConfirmationButtons' Save button *should* prevent multiple clicks when the form is busy
      * but in case that changes in the future, the form should still debouce the save
      */
    //* Arrange
    let resolve;
    mockedDataService.createTicket
      .mockImplementation(async () => new Promise((r) => { resolve = r; }));
    setup(true);

    //* Act
    fireEvent.click(screen.queryByLabelText(SaveCancelLabels.Save));
    fireEvent.click(screen.queryByLabelText(SaveCancelLabels.Save));
    fireEvent.click(screen.queryByLabelText(SaveCancelLabels.Save));
    // Simulate service call completion
    await waitFor(() => resolve());

    //* Assert
    expect(mockedDataService.createTicket).toHaveBeenCalledTimes(1);
  });

  it('should show errors in the dialog', async () => {
    //* Arrange
    let reject;
    mockedDataService.createTicket
      .mockImplementation(async () => new Promise((_undefined, r) => { reject = r; }));
    const testError = 'Test fetch failed';
    setup(true);

    //* Act
    fireEvent.click(screen.queryByLabelText(SaveCancelLabels.Save));
    await waitFor(() => expect(mockedDataService.createTicket)
      .toHaveBeenCalledTimes(1));

    //* Assert
    await waitFor(() => reject(new Error(testError)));
    const errorMessage = await screen.findByText(testError);
    expect(errorMessage).toBeInTheDocument();
  });
  describe('when in read-only mode', () => {
    beforeEach(() => {
      setup(true, mockTicket.id);
    });
    const getFields = async () => {
      const firstName = await screen.findByDisplayValue(mockClient.first_name);
      const petName = await screen.findByDisplayValue(mockPet.name);
      const description = await screen.findByDisplayValue(mockTicket.description);
      return [firstName, petName, description];
    };
    it('should load the ticket from the hook', async () => {
      //* Arrange
      // Spot check that client/pet/ticket sections are displaying data
      // Assumption is each section has its own exhaustive tests for each individual field
      const fields = await getFields();

      //* Assert
      expect(mockUseTicketById).toHaveBeenCalledWith(mockTicket.id);
      fields.forEach((field) => expect(field).toBeInTheDocument());
    });
    it('should disable the controls', async () => {
      //* Arrange
      // Spot check that client/pet/ticket sections are disabled
      // Assumption is each section has its own exhaustive tests for each individual field
      const fields = await getFields();

      //* Assert
      fields.forEach((field) => expect(field).toBeDisabled());
    });
  });
});
