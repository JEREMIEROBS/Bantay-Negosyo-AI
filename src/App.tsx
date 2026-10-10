import React, { useEffect } from 'react';
import { AppLayout } from '@/renderer/components/layout/AppLayout';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';

export const App: React.FC = () => {
  const { loadInitialData, isLoading, error } = useNegosyoStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cloud p-4 text-ink">
        <div className="max-w-md w-full bg-white p-6 rounded-card border border-red-300 shadow-modal text-center space-y-3">
          <h2 className="text-lg font-bold text-red-700">Nagka-aberya sa Sistema</h2>
          <p className="text-xs text-ink-600">{error}</p>
          <button
            onClick={() => loadInitialData()}
            className="btn-primary text-xs"
          >
            Subukang Muli (Retry)
          </button>
        </div>
      </div>
    );
  }

  return <AppLayout />;
};

export default App;
