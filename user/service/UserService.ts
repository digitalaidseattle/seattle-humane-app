
type Session = {
  role: string;
}


class UserService {

  constructor() {

  }

  getSession(): Promise<Session> {

    // dummy return until it gets set up
    return Promise.resolve({role: 'admin'});
  }

}

const userService = new UserService();

export { userService };
export type { Session };