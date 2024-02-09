import { ReactNode } from "react";

const AuctionsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 md:px-8">
      {children}
    </div>
  );
};

export default AuctionsLayout;
