import { TicketSearchContext } from '@context/dashboard/ticketSearchContext';
import * as DataService from '@services/DataService';
import { useContext } from 'react';
import useSWR from 'swr';

export default function useAllTickets() {
  const search = useContext(TicketSearchContext);
  const {
    data, isLoading, isValidating, mutate,
  } = useSWR(
    /*
    * Theres nothing special about this string.
    * We can really use any unique cache key here, but we want it to be unique for each search query
    * since each search query returns different results.
    */
    `allTickets(${search})`,
    async () => DataService.searchServiceRequests(search),
    {
      /*
      * Override the SWR default dedupingInterval of 2000ms.
      * If you submitted or cleared the search within 2 seconds
      * of the previous search you wouldn't see the results get updated,
      * which is a bad user experience (things seemed broken).
      */
      dedupingInterval: 500,
    },
  );

  return {
    data: data ?? [], isLoading, isValidating, mutate,
  };
}
