/**
 *  AppService.ts
 *
 *  For application wide services
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { useEffect, useState } from "react";
import { AppConstant, appService } from "./AppService";

const useAppConstants = (type: string) => {
    const [data, setData] = useState<AppConstant[]>([]);

    useEffect(() => {
        appService.getAppConstants(type)
            .then(resp => setData(resp))
    }, [type]);

    return { data: data };
};

export { useAppConstants };

