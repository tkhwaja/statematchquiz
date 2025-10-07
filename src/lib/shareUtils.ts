import { StateScore } from "./types";

export const generateShareText = (results: StateScore[]): string => {
  const topThree = results.slice(0, 3);
  
  let shareText = "🏡 I found my perfect states on StateMatch!\n\n";
  
  topThree.forEach((result, index) => {
    shareText += `#${index + 1} ${result.state} - ${result.score}% match\n`;
  });
  
  shareText += `\nFind your perfect state at ${window.location.origin}`;
  
  return shareText;
};

export const getShareUrl = (): string => {
  return window.location.href;
};

export const isWebShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
};
