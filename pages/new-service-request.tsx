import ClientInformationSection from '@components/serviceRequest/ClientInformationSection';
import PetInformationSection from '@components/serviceRequest/PetInformationSection';
import ServiceInformationSection from '@components/serviceRequest/ServiceInformationSection';
import { ClientInformationProvider } from '@context/serviceRequest/clientInformationContext';
import { PetInformationProvider } from '@context/serviceRequest/petInformationContext';
import { ServiceInformationProvider } from '@context/serviceRequest/serviceInformationContext';
import useServiceRequestForm from '@hooks/useServiceRequestForm';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { mutate } from 'swr';

const Labels = {
  submit: 'Submit',
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const ticketId = searchParams.get('ticket');
  const submitted = searchParams.get('submitted') === 'true';
  const {
    disabled, clearForm, save, message, client, pets, tickets,
    clientInformationDispatch, petInformationDispatch, serviceInformationDispatch,
  } = useServiceRequestForm(ticketId);

  const handleSubmit = async () => {
    const success = await save();
    if (success) {
      mutate('dataservice/alltickets');
      clearForm();
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('submitted', 'true');
      router.push(`${pathname}?${newSearchParams.toString()}`);
    }
  };
  return (
    <div
      style={{
        margin: '0 auto', width: '850px', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'white',
      }}
      className="col-12 md:col-12"
    >
      <header style={{ alignSelf: 'center' }}>
        <h2 className="font-bold mt-2">New Service Request</h2>
      </header>
      {submitted && <h3 className="text-center" style={{ margin: 'auto' }}>Your request has been submitted, thank you!</h3>}
      {!submitted
        && (
          <>
            <div
              className="card border-none"
              style={{
                height: '100%',
                overflowY: 'scroll',
              }}
            >
              {message && (
                <h3 className="text-red-500">
                  {message}
                </h3>
              )}
              <ClientInformationProvider
                state={client}
                dispatch={clientInformationDispatch}
              >
                <ClientInformationSection disabled={disabled} />
              </ClientInformationProvider>
              <PetInformationProvider state={pets} dispatch={petInformationDispatch}>
                <PetInformationSection disabled={disabled} />
                <ServiceInformationProvider
                  state={tickets}
                  dispatch={serviceInformationDispatch}
                >
                  <ServiceInformationSection
                    show={['service_category', 'description']}
                    disabled={disabled}
                    variant="external"
                  />
                </ServiceInformationProvider>
              </PetInformationProvider>
            </div>
            <footer className="footer" style={{ alignSelf: 'flex-end', marginTop: '-20px' }}>
              <Button label={Labels.submit} disabled={disabled} icon="pi pi-check" className="p-button-text" loading={disabled} onClick={handleSubmit} />
            </footer>
          </>
        )}
    </div>
  );
}
