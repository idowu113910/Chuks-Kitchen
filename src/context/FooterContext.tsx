import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface FooterContextType {
  hideFooter: boolean;
  setHideFooter: (value: boolean) => void;
}

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export const FooterProvider = ({ children }: { children: ReactNode }) => {
  const [hideFooter, setHideFooter] = useState(false);

  return (
    <FooterContext.Provider value={{ hideFooter, setHideFooter }}>
      {children}
    </FooterContext.Provider>
  );
};

export const useFooter = () => {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error("useFooter must be used within a FooterProvider");
  }
  return context;
};
