export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // If root or path has no extension, env.ASSETS will automatically serve index.html or matching html
    return env.ASSETS.fetch(request);
  },
};
