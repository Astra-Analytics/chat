import { Plugin, PluginID } from '@/types/plugin';

export const getEndpoint = (plugin: Plugin | null) => {
  const url = process.env.OPENAI_API_HOST;
  if (!plugin) {
    return `${url}/chat`;
  }

  if (plugin.id === PluginID.GOOGLE_SEARCH) {
    return 'api/google';
  }

  return 'api/chat';
};
