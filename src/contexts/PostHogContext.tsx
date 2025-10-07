import { createContext, useContext, useEffect } from 'react';
import posthog from 'posthog-js';

const PostHogContext = createContext(null);

export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Replace with your PostHog project API key from https://app.posthog.com/project/settings
    posthog.init('YOUR_POSTHOG_API_KEY', {
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
