import { useEffect, useState } from 'react';
import * as DataService from '@services/DataService';
import { AppConstantType } from '@types';

export type TeamMeberOption = Pick<AppConstantType, 'label' | 'value'>;

export default function useTeamMembers() {
  const [options, setOptions] = useState<TeamMeberOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const teamMembers = await DataService.getTeamMembers();
      const newOptions: TeamMeberOption[] = [];
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
