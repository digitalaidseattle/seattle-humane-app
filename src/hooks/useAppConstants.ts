import { useEffect, useState } from 'react';
import { AppConstantType } from '@types';
import { AppConstants } from 'src/constants';
import * as DataService from '@services/DataService';

export default function useAppConstants(type: AppConstants) {
  const [data, setData] = useState<AppConstantType[]>([]);

  useEffect(() => {
    DataService.getAppConstants(type)
      .then((resp) => setData(resp));
  }, [type]);

  return data;
}
