import { useState, useEffect } from 'react';
import { createInstance, initSDK, SepoliaConfig } from '@zama-fhe/relayer-sdk/bundle';

export function useZamaInstance() {
  const [instance, setInstance] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeZama = async () => {
      if (!window.ethereum) {
        setError('Ethereum provider not found');
        setIsLoading(false);
        return;
      }
      
      try {
        await initSDK();
        const zamaInstance = await createInstance(SepoliaConfig);
        setInstance(zamaInstance);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize Zama instance:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize FHE service');
      } finally {
        setIsLoading(false);
      }
    };

    initializeZama();
  }, []);

  return { instance, error, isLoading };
}
