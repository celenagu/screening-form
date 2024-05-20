// context/headerContext.

import React, { createContext, useState } from 'react';

const HeaderContext = createContext({
  title: 'Home', 
  setTitle: (newTitle) => {}, 
});

export const HeaderProvider = ({ children }) => {
  const [title, setTitle] = useState('Home'); // Default title
  return (
    <HeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </HeaderContext.Provider>
  );
};

export default HeaderContext;