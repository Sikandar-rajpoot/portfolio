import { formatTimecode, readingTime } from '~/utils/timecode';

const modules = import.meta.glob('../articles.*.mdx', { eager: true });
const rawModules = import.meta.glob('../articles.*.mdx', { query: '?raw', import: 'default', eager: true });

export async function getPosts() {
  const build = await import('virtual:remix/server-build');

  const posts = Object.entries(modules).map(([file, post]) => {
    let id = file.replace('../', 'routes/').replace(/\.mdx$/, '');
    let slug = build.routes[id]?.path;
    if (slug === undefined) throw new Error(`No route for ${id}`);

    const rawText = rawModules[file];
    const readTime = readingTime(rawText);
    const timecode = formatTimecode(readTime);

    return {
      slug,
      timecode,
      frontmatter: post.frontmatter,
    };
  });

  return sortBy(posts, post => post.frontmatter.date, 'desc');
}

function sortBy(arr, key, dir = 'asc') {
  return arr.sort((a, b) => {
    const res = compare(key(a), key(b));
    return dir === 'asc' ? res : -res;
  });
}

function compare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
