function prefersMarkdown(accept = '') {
  const quality = new Map();
  for (const range of accept.split(',')) {
    const [mediaType, ...parameters] = range.trim().toLowerCase().split(';');
    const q = parameters.find((parameter) => /^\s*q\s*=/.test(parameter));
    const value = q ? q.split('=')[1].trim() : '1';
    const weight = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?|\.\d{1,3})$/.test(value) ? Number(value) : 0;
    const type = mediaType.trim();
    quality.set(type, Math.max(quality.get(type) ?? 0, weight));
  }
  const markdown = quality.get('text/markdown') ?? 0;
  const html = quality.get('text/html') ?? quality.get('text/*') ?? quality.get('*/*') ?? 0;
  return markdown > 0 && markdown >= html;
}

const LINK = [
  '<https://webpkit.app/llms.txt>; rel="llms-txt"',
  '<https://webpkit.app/sitemap.xml>; rel="sitemap"'
].join(', ');

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  if (request.method === 'GET' && prefersMarkdown(request.headers.get('accept') || '')) {
    const markdownUrl = new URL(request.url);
    markdownUrl.pathname = (url.pathname === '/' ? '/index' : url.pathname.replace(/\/$/, '')) + '.md';
    const markdown = await next(new Request(markdownUrl, request));
    if (markdown.ok && !(markdown.headers.get('content-type') || '').includes('text/html')) {
      const headers = new Headers(markdown.headers);
      headers.set('content-type', 'text/markdown; charset=utf-8');
      headers.set('vary', 'Accept');
      headers.set('Link', LINK);
      return new Response(markdown.body, { status: 200, headers });
    }
  }

  const response = await next();
  const headers = new Headers(response.headers);
  headers.set('Vary', 'Accept');
  headers.set('Link', LINK);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
