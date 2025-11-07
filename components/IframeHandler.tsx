'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function IframeHandler({ children }: { children: React.ReactNode }) {
  const [isInIframe, setIsInIframe] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    // Detect if running in iframe
    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);
    
    if (inIframe) {
      // Set cookies to work in iframe context
      document.cookie = "clerk-iframe=true; SameSite=None; Secure";
    }
  }, []);

  if (isInIframe && !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">
            Please sign in to access Mentora features.
          </p>
          <a 
            href={`${window.location.origin}/sign-in`}
            target="_parent"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}