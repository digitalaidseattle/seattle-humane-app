import { useEffect, useState } from 'react';
import * as DataService from '@services/DataService';

type Option = {
  value: string
  label: string
};

export default function useTeamMembers() {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const teamMembers = await DataService.getTeamMembers();
      const newOptions: Option[] = [];
      teamMembers.forEach((r) => {
        if (typeof r === 'object') {
          newOptions.push({
            value: r.id,
            label: r.email,
          });
        }
      });
      setOptions(newOptions);
    };
    fetchData();
  }, []);
  return options;
}
