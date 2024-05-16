import { clientInformationLabels } from '@components/serviceRequest/ClientInformationSection';
import { petInformationLabels } from '@components/serviceRequest/PetInformationSection';
import { serviceInformationLabels } from '@components/serviceRequest/ServiceInformationSection';
import ServiceRequestDialog from '@components/serviceRequest/ServiceRequestDialog';
import { defaultClientInformation } from '@context/serviceRequest/clientInformationContext';
import { defaultPetInformation } from '@context/serviceRequest/petInformationContext';
import { defaultServiceInformation } from '@context/serviceRequest/serviceInformationContext';
import '@testing-library/jest-dom';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import { useState } from 'react';
import { clientService } from 'src/services/ClientService';

//* Mock clientService
jest.mock('src/services/ClientService', () => {
  const orig = jest.requireActual('src/services/ClientService');
  return {
    ...orig,
    clientService: {
      newRequest: jest.fn(),
    },
  };
});

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
  const mockOnClose = jest.fn();
  function PageComponent({ showOnOpen }) {
    const [visible, setVisible] = useState(showOnOpen);
    mockOnClose.mockImplementation(() => setVisible(false));
    return <ServiceRequestDialog visible={visible} onClose={mockOnClose} />;
  }

  function setup(showOnOpen = false) {
    render(
      <PageComponent showOnOpen={showOnOpen} />,
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

  it('should call the service to create a new request when save is pressed', async () => {
    //* Arrange
    setup(true);

    //* Act
    fireEvent.click(screen.queryByLabelText(SaveCancelLabels.Save));
    await waitFor(() => expect(clientService.newRequest).toHaveBeenCalledTimes(1));

    //* Assert
    expect(clientService.newRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(defaultServiceInformation),
      expect.objectContaining(defaultClientInformation),
      expect.objectContaining(defaultPetInformation),
    );
  });

  it('should disable the form while saving', async () => {
    //* Arrange
    // Capture resolve to "pause" the promise and check that fields are disabled
    let resolve;
    clientService.newRequest = jest.fn()
      .mockImplementation(async () => new Promise((r) => { resolve = r; }));
    setup(true);

    //* Act
    fireEvent.click(screen.queryByLabelText(SaveCancelLabels.Save));
    await waitFor(() => expect(clientService.newRequest).toHaveBeenCalledTimes(1));

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
    clientService.newRequest = jest.fn()
      .mockImplementation(async () => new Promise((r) => { resolve = r; }));
    setup(true);

    //* Act
    fireEvent.click(screen.queryByLabelText(SaveCancelLabels.Save));
    fireEvent.click(screen.queryByLabelText(SaveCancelLabels.Save));
    fireEvent.click(screen.queryByLabelText(SaveCancelLabels.Save));
    // Simulate service call completion
    await waitFor(() => resolve());

    //* Assert
    expect(clientService.newRequest).toHaveBeenCalledTimes(1);
  });

  it('should show errors in the dialog', async () => {
    //* Arrange
    let reject;
    clientService.newRequest = jest.fn()
      .mockImplementation(async () => new Promise((_undefined, r) => { reject = r; }));
    const testError = 'Test fetch failed';
    setup(true);

    //* Act
    fireEvent.click(screen.queryByLabelText(SaveCancelLabels.Save));
    await waitFor(() => expect(clientService.newRequest).toHaveBeenCalledTimes(1));

    //* Assert
    await waitFor(() => reject(new Error(testError)));
    const errorMessage = await screen.findByText(testError);
    expect(errorMessage).toBeInTheDocument();
  });
});
