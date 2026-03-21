import type { FC } from "react";

const PageLoader: FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      </div>
    </div>
  );
};

export default PageLoader;
