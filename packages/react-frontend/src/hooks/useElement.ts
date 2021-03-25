import { useEffect, useState } from "react";

export const useElementSize = (htmlId: string) => {
    const [elementSize, setElementSize] = useState<Record<string, number | undefined>>({
      width: undefined,
      height: undefined,
    });
  
    useEffect(() => {
      const handleResize = () => {
        const elem = document.getElementById(htmlId);
        if (!elem) {
          return;
        }
        const elemInfo = elem.getBoundingClientRect();
        setElementSize({
          width: elemInfo.width,
          height: elemInfo.height,
        });
      }
      
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    
    }, []); 
    
    return elementSize;
  }