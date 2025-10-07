import { createContext, useContext, useEffect } from 'react';
import posthog from 'posthog-js';

const PostHogContext = createContext(null);

export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
    
    if (!apiKey) {
      console.warn('PostHog API key not found');
      return;
    }

    posthog.init(apiKey, {
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
