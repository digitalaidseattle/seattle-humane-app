import { useEffect, useState } from 'react';
import { clientService } from 'src/services/ClientService';

type Option = {
  value: string
  label: string
};

export default function useTeamMembers() {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const teamMembers = await clientService.getTeamMembers();
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
  return { data: options };
}
