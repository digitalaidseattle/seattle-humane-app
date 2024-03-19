/**
 *  AppService.ts
 *
 *  For application wide services
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import supabaseClient from "../../utils/supabaseClient";


type AppConstant = {
  value: string,
  label: string
}

class AppService {

  cache: Map<string, AppConstant[]> = null;

  // constructor() {

  // We could do this instead of lazy-init in the getAppConstants, 
  // but testing gets messed up.

  // this.lookup()
  //   .then(m => this.cache = m)
  //   .catch(err => console.error(err))
  // }

  getAppConstants = async (type: string): Promise<AppConstant[]> => {
    if (this.cache === null) {
      return this.lookup()
        .then(m => {
          this.cache = m;
          return this.cache.get(type);
        })
    } else {
      return Promise.resolve(this.cache.get(type));
    }
  }

  lookup = async () => {
    const map = new Map();
    const response = await supabaseClient
      .from('app_constants')
      .select();
    response.data.forEach((c) => {
      if (!map.has(c.type)) {
        map.set(c.type, []);
      }
      map.get(c.type).push(c);
    });
    return map;
  }
}

const appService = new AppService();
export { appService };
export type { AppConstant };