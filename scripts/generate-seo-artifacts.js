import {
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(ROOT, 'dist');
const BLOG_DIR = resolve(ROOT, 'src/content/blog');
const SITE = 'https://primaroster.com';

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}

function stripHtml(value = '') {
  return String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function replaceElementContents(html, id, contents) {
  const openTag = new RegExp(`<div\\b(?=[^>]*\\bid=["']${id}["'])[^>]*>`, 'i');
  const match = openTag.exec(html);
  if (!match) throw new Error(`Could not find #${id} in built HTML`);

  const contentStart = match.index + match[0].length;
  const divTag = /<\/?div\b[^>]*>/gi;
  divTag.lastIndex = contentStart;
  let depth = 1;
  let token;
  while ((token = divTag.exec(html))) {
    if (/^<\/div/i.test(token[0])) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return html.slice(0, contentStart) + contents + html.slice(token.index);
    }
  }
  throw new Error(`Could not find closing div for #${id}`);
}

function loadArticles() {
  return readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith('.json'))
    .map((name) => {
      const id = name.slice(0, -5);
      const article = JSON.parse(readFileSync(resolve(BLOG_DIR, name), 'utf8'));
      for (const key of ['title', 'date', 'image', 'excerpt', 'content']) {
        if (!article[key]) throw new Error(`${name} is missing ${key}`);
      }
      return { id, ...article };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderBlogCard(article, index) {
  const href = `/artikel/${encodeURIComponent(article.id)}/`;
  return `<div class="product-card fade-in" style="transition-delay:${index * 0.05}s"><a href="${href}"><div class="product-img-wrapper"><img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}" loading="lazy"></div><div class="product-info"><span class="category">${escapeHtml(article.date)}</span><h2 style="font-size:1.2rem">${escapeHtml(article.title)}</h2><p>${escapeHtml(article.excerpt)}</p><span class="btn btn-outline btn-sm" style="margin-top:10px">Baca Selengkapnya</span></div></a></div>`;
}

function renderArticle(article, cssFile, mainBundle) {
  const canonical = `${SITE}/artikel/${encodeURIComponent(article.id)}/`;
  const title = `${article.title} | Prima Roster`;
  const image = new URL(article.image, `${SITE}/`).href;
  const articleContent = article.content.replaceAll('/produk.html', '/produk').replaceAll('/blog.html', '/blog');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: [image],
    datePublished: article.date,
    dateModified: article.date,
    author: { '@type': 'Organization', name: 'Prima Roster', url: `${SITE}/` },
    publisher: {
      '@type': 'Organization',
      name: 'Prima Roster',
      logo: { '@type': 'ImageObject', url: `${SITE}/logo_icon.png` },
    },
    mainEntityOfPage: canonical,
  };
  const schemaJson = JSON.stringify(schema).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(article.excerpt)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Prima Roster">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(article.excerpt)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${escapeHtml(image)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(article.excerpt)}">
<meta name="twitter:image" content="${escapeHtml(image)}">
<script type="application/ld+json">${schemaJson}</script>
<link rel="stylesheet" href="/assets/${escapeHtml(cssFile)}">
<link rel="icon" type="image/png" href="/logo_icon.png">
<style>
.article-header{padding:150px 0 50px;text-align:center;max-width:800px;margin:0 auto}.article-meta{color:var(--color-text-light);margin-bottom:20px;font-size:.9rem}.article-featured-image{width:100%;max-width:900px;margin:0 auto 50px;border-radius:12px;overflow:hidden;box-shadow:var(--shadow-sm)}.article-featured-image img{width:100%;height:auto}.article-content{max-width:800px;margin:0 auto 80px;font-size:1.1rem;line-height:1.8;color:#444}.article-content h2,.article-content h3{margin-top:40px;margin-bottom:15px}.article-content p{margin-bottom:20px}
</style>
</head>
<body>
<nav class="navbar scrolled"><div class="container nav-container"><a href="/" class="logo">Prima Roster.</a><div class="menu-toggle" id="mobile-menu"><span class="bar"></span><span class="bar"></span><span class="bar"></span></div><ul class="nav-links"><li><a href="/#beranda">Beranda</a></li><li><a href="/produk">Katalog</a></li><li><a href="/blog">Blog</a></li></ul><a href="https://wa.me/6281381267900" target="_blank" rel="noopener" class="btn btn-primary nav-btn">Hubungi Kami</a></div></nav>
<main class="container fade-in">
<div class="article-header"><div class="article-meta">Diterbitkan pada: <time datetime="${escapeHtml(article.date)}">${escapeHtml(article.date)}</time></div><h1>${escapeHtml(article.title)}</h1></div>
<div class="article-featured-image"><img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}"></div>
<div class="article-content">${articleContent}<p class="text-center mt-4"><a href="/blog" class="btn btn-outline">← Kembali ke Blog</a></p></div>
</main>
<footer class="footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><h3>Prima Roster.</h3><p>Ventilasi + Desain dalam satu solusi.</p></div><div class="footer-links"><h4>Menu Cepat</h4><ul><li><a href="/">Beranda</a></li><li><a href="/produk">Katalog</a></li><li><a href="/blog">Blog</a></li></ul></div><div class="footer-contact"><h4>Hubungi Kami</h4><p>0813-8126-7900</p><p>info@primaroster.com</p><p>Jl. Lingkar Selatan Pemda Tigaraksa no. 8a. Kabupaten Tangerang</p></div></div><div class="footer-bottom"><p>&copy; 2026 Prima Roster. All rights reserved.</p></div></div></footer>
<script type="module" src="/assets/${escapeHtml(mainBundle)}"></script>
</body>
</html>`;
}

export function generateSeoArtifacts() {
  const articles = loadArticles();
  const assetsDir = resolve(DIST, 'assets');
  const cssFile = readdirSync(assetsDir).find((name) => /^style-.*\.css$/.test(name));
  const mainBundle = readdirSync(assetsDir).find((name) => /^main-.*\.js$/.test(name));
  if (!cssFile || !mainBundle) throw new Error('Vite output CSS/JS bundles were not found');

  const blogPath = resolve(DIST, 'blog.html');
  const blogHtml = readFileSync(blogPath, 'utf8');
  const cards = articles.map(renderBlogCard).join('\n');
  writeFileSync(blogPath, replaceElementContents(blogHtml, 'blog-list', cards));

  for (const article of articles) {
    const outputDir = resolve(DIST, 'artikel', article.id);
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(resolve(outputDir, 'index.html'), renderArticle(article, cssFile, mainBundle));
  }

  const staticUrls = ['/', '/produk', '/blog'];
  const urls = [
    ...staticUrls.map((path) => `<url><loc>${SITE}${path}</loc></url>`),
    ...articles.map((article) => `<url><loc>${SITE}/artikel/${encodeURIComponent(article.id)}/</loc><lastmod>${escapeHtml(article.date)}</lastmod></url>`),
  ];
  writeFileSync(resolve(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  ${url}`).join('\n')}\n</urlset>\n`);
}
