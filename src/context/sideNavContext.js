import { createContext, useState } from "react";

const SideNavCtx = createContext(undefined);
const SideNavDispatchCtx = createContext(undefined);

function SideNavProvider({ children }) {
  const localOpen = localStorage.getItem("isSideOpen")
  const [open, setOpen] = useState(localOpen);

  const handleDrawerOpen = () => {
    setOpen((open) => {
      localStorage.setItem("isSideOpen", !open)
      return !open
    });
  };
  return (
    <SideNavCtx.Provider value={{ open }}>
      <SideNavDispatchCtx.Provider value={{ handleDrawerOpen }}>
        {children}
      </SideNavDispatchCtx.Provider>
    </SideNavCtx.Provider>
  );
}

export { SideNavProvider, SideNavCtx, SideNavDispatchCtx };
