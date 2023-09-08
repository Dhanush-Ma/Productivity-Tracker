import { useState, createContext } from "react";

export const Context = createContext("");

const ContextProvider = (props) => {
  const [data, setData] = useState({});
  const id = "cobpilibcfpjgkcklmhgagemnjmhdlmi";

  return (
    <Context.Provider
      value={{
        data,
        setData,
        id,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
