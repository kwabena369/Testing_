export const authenticateUser = (userData: { email: string; password: string }) => {
    return {
      type: 'AUTHENTICATE_USER',
      payload: userData,
    };
  };
  