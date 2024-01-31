
type Session = {
  role: string;
  authenticated: boolean;
  //Probably some other stuff
}


class UserService {

  constructor() {

  }

  getSession(): Promise<Session> {

    // dummy return until it gets set up
    return Promise.resolve({role: 'user', authenticated: true});
  }

}

const userService = new UserService();

export { userService };
export type { Session };