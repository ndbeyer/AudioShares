import React from 'react';

const UserContext = React.createContext();

export const UserProvider = ({children}) => {
  const [user, setUser] = React.useState(null);

  const value = React.useMemo(() => ({
      user, setUser
  }),[user])

  return (
    <UserContext.Provider
      value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => React.useContext(UserContext);