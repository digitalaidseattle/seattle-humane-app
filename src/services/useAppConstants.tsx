import { useEffect, useState } from "react";
import supabaseClient from "../../utils/supabaseClient";

type AppConstant = {
    value: string,
    label: string
}

const cache: Record<string, AppConstant[]> = {}

const useAppConstants = (type: string) => {
    const [init, setInit] = useState(false);
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState<AppConstant[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setStatus('fetching');
            if (!init) {
                const response = await supabaseClient.from('app_constants')
                    .select()
                const types = new Set(response.data.map(c => c.type));
                types.forEach(t => cache[t] = response.data.filter(c => c.type === t));
                setInit(true);
            }
            const data = cache[type];
            setData(data);
            setStatus('fetched');
        };
        fetchData();
    }, [init, type]);

    return { status, data };
};

export { useAppConstants };
export type { AppConstant };
