// authService.test.js
import { AuthService } from "../src/services/authService";
import supabaseClient from "../utils/supabaseClient";

jest.mock("../utils/supabaseClient", () => ({
  auth: {
    signOut: jest.fn(),
    getUser: jest.fn(),
    signInWithOAuth: jest.fn(),
  },
}));

// NOTE: These test are all fairly 'shallow' and should be augmented by
// E2E tests in order to actually test supabase connection
describe("AuthService", () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService();
  });

  it("should sign out", async () => {
    await authService.signOut();
    expect(supabaseClient.auth.signOut).toHaveBeenCalled();
  });

  it("should check if user exists", () => {
    supabaseClient.auth.getUser.mockReturnValueOnce(null);
    expect(authService.hasUser()).toBe(false);

    supabaseClient.auth.getUser.mockReturnValueOnce({});
    expect(authService.hasUser()).toBe(true);
  });

  it("should get user", async () => {
    const mockUser = { id: "1", email: "test@test.com" };
    supabaseClient.auth.getUser.mockResolvedValueOnce(mockUser);

    const user = await authService.getUser();
    expect(user).toEqual(mockUser);
  });

  it("should sign in with Google", async () => {
    const mockResponse = {
      user: { id: "1", email: "test@test.com" },
      session: {},
    };
    supabaseClient.auth.signInWithOAuth.mockResolvedValueOnce(mockResponse);

    const response = await authService.signInWithGoogle();
    expect(response).toEqual(mockResponse);
  });

  it("should sign in with Azure", async () => {
    const mockResponse = {
      user: { id: "1", email: "test@test.com" },
      session: {},
    };
    supabaseClient.auth.signInWithOAuth.mockResolvedValueOnce(mockResponse);

    const response = await authService.signInWithAzure();
    expect(response).toEqual(mockResponse);
  });
});
