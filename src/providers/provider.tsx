import Chekauth from "@/components/auth/checkauth";

import React, { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

const Provider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster 
       position="bottom-center"
       reverseOrder={false}
      />
      <Chekauth/>
    </>
  );
};

export default Provider;
