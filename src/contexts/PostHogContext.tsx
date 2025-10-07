import { createContext, useContext, useEffect } from 'react';
import posthog from 'posthog-js';

const PostHogContext = createContext(null);

export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    posthog.init('phc_SsJXq6AmOHYQsp8IXiyowjjFGcjYpq7FIzE4cXI3c8k', {
      api_host: 'https://app.posthog.com',
      autocapture: false,
      capture_pageview: false,
    });
  }, []);

  return <PostHogContext.Provider value={null}>{children}</PostHogContext.Provider>;
};

export const usePostHog = () => {
  return posthog;
};
