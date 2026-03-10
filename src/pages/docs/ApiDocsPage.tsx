import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const ApiDocsPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(0);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setReloadKey((previous) => previous + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-[100dvh] w-full relative">
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-10 bg-slate-50/95 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto p-6 pt-10 space-y-4">
              <p className="text-sm font-semibold text-slate-900">Loading API documentation</p>
              <p className="text-sm text-slate-600">Next: review endpoints, payloads, and examples in this view.</p>
              <LoadingSkeleton variant="text" className="h-8 w-72" />
              <LoadingSkeleton variant="card" className="h-[72vh] w-full" />
            </div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-slate-50">
            <Card padding="lg" variant="elevated" className="w-full max-w-lg text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600" size={26} />
              </div>
              <h1 className="text-xl font-semibold text-slate-900 mb-2">Unable to load API documentation</h1>
              <p className="text-sm text-slate-600 mb-6">
                The docs view did not load. Check your network, then try reloading this page.
              </p>
              <p className="text-xs text-slate-500 mb-4">Next: if this keeps failing, open `/docs/api-docs.html` directly.</p>
              <div className="flex justify-center">
                <Button variant="outline" icon={RefreshCw} onClick={handleRetry}>
                  Try Reloading
                </Button>
              </div>
            </Card>
          </div>
        )}

        <iframe
          key={reloadKey}
          title="PayBridge API Documentation"
          src="/docs/api-docs.html"
          className="h-full w-full border-0"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </div>
    </div>
  );
};
