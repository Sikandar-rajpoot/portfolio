import { createRequestHandler } from '@remix-run/cloudflare';
import * as build from './build/server';

const handleRequest = createRequestHandler(build);

export default {
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request, {
        cloudflare: { env, ctx },
      });
    } catch (error) {
      console.error(error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
