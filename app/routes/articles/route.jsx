import { json } from '@remix-run/cloudflare';
import { Outlet, useLoaderData } from '@remix-run/react';
import { MDXProvider } from '@mdx-js/react';
import { Post, postMarkdown } from '~/layouts/post';
import { baseMeta } from '~/utils/meta';
import config from '~/config.json';
import { formatTimecode, readingTime } from '~/utils/timecode';

const mdxModules = import.meta.glob('../articles.*.mdx', { eager: true });
const rawModules = import.meta.glob('../articles.*.mdx', { query: '?raw', import: 'default', eager: true });

export async function loader({ request }) {
  const url = new URL(request.url);
  const slug = url.pathname.split('/').filter(Boolean).pop();
  const moduleKey = `../articles.${slug}.mdx`;
  const module = mdxModules[moduleKey];
  const rawText = rawModules[moduleKey];

  if (!module) {
    throw new Response('Not Found', { status: 404 });
  }

  const readTime = readingTime(rawText);
  const ogImage = `${config.url}/static/${slug}-og.jpg`;

  return json({
    ogImage,
    frontmatter: module.frontmatter,
    timecode: formatTimecode(readTime),
  });
}

export function meta({ data }) {
  const { title, abstract } = data.frontmatter;
  return baseMeta({ title, description: abstract, prefix: '', ogImage: data.ogImage });
}

export default function Articles() {
  const { frontmatter, timecode } = useLoaderData();

  return (
    <MDXProvider components={postMarkdown}>
      <Post {...frontmatter} timecode={timecode}>
        <Outlet />
      </Post>
    </MDXProvider>
  );
}
