import { useEffect, useState } from "react";

const useImagePreloader = (urls: string[]): boolean => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const promises = urls.map(src =>
      new Promise<void>(res => {
        const img = new Image();
        img.src = src;
        img.onload = () => res();
        img.onerror = () => res();
      })
    );

    Promise.allSettled(promises).then(() => {
      if (isMounted) setLoaded(true);
    });

    return () => {
      isMounted = false;
    };
  }, [urls]);

  return loaded;
}

export default useImagePreloader;
