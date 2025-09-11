import { useEffect } from "react";
import logo from "../../assets/logo.png"

const LoadingOverlay = () => {
  useEffect(() => {
    const body = document.querySelector('body');
    body?.classList.add('no-scroll');
  
    return () => {
      body?.classList.remove('no-scroll');
    }
  }, [])
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
      <div className="mx-auto text-center space-y-5">
        <img src={logo} alt="Loading......" className="animate-spin delay-1000 mx-auto text-primary-normal  w-28 h-28" />
      </div>
    </div>
  );
};

export default LoadingOverlay;