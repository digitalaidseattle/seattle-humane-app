import { useEffect, useState } from 'react';
import { AppConstantType } from '@types';
import { AppConstants } from 'src/constants';
import { clientService } from 'src/services/ClientService';

export default function useAppConstants(type: AppConstants) {
  const [data, setData] = useState<AppConstantType[]>([]);

  useEffect(() => {
    clientService.getAppConstants(type)
      .then((resp) => setData(resp));
  }, [type]);

  return data;
}