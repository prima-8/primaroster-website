import './style.css';

document.addEventListener('DOMContentLoaded', async () => {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('is-active');
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('is-active');
        navLinks.classList.remove('active');
      });
    });
  }
  
  // Load blog articles from the content folder
  const modules = import.meta.glob('./src/content/blog/*.json');
  const blogArticles = [];

  for (const path in modules) {
    const mod = await modules[path]();
    const id = path.split('/').pop().replace('.json', '');
    blogArticles.push({ id, ...mod.default });
  }

  // Sort articles by date descending
  blogArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Render Blog List (if on blog.html)
  const blogListContainer = document.getElementById('blog-list');
  if (blogListContainer) {
    let html = '';
    blogArticles.forEach((article, index) => {
      const delay = index * 0.1;
      html += `
        <div class="product-card fade-in" style="transition-delay: ${delay}s">
          <a href="/article.html?id=${article.id}">
            <div class="product-img-wrapper">
              <img src="${article.image}" alt="${article.title}" loading="lazy">
            </div>
            <div class="product-info">
              <span class="category">${article.date}</span>
              <h3 style="font-size: 1.2rem;">${article.title}</h3>
              <p>${article.excerpt}</p>
              <span class="btn btn-outline btn-sm" style="margin-top:10px;">Baca Selengkapnya</span>
            </div>
          </a>
        </div>
      `;
    });
    blogListContainer.innerHTML = html;
  }

  // Render Single Article (if on article.html)
  const articleContainer = document.getElementById('article-container');
  if (articleContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (articleId) {
      const article = blogArticles.find(a => a.id === articleId);
      if (article) {
        document.title = `${article.title} - Prima Roster Blog`;
        
        articleContainer.innerHTML = `
          <div class="article-header">
            <div class="article-meta">Diterbitkan pada: ${article.date}</div>
            <h1>${article.title}</h1>
          </div>
          <div class="article-featured-image">
            <img src="${article.image}" alt="${article.title}">
          </div>
          <div class="article-content">
            ${article.content}
            <div class="text-center mt-4">
              <a href="/blog.html" class="btn btn-outline">← Kembali ke Blog</a>
            </div>
          </div>
        `;
      } else {
        articleContainer.innerHTML = `<div class="article-header"><h1>Artikel tidak ditemukan.</h1><a href="/blog.html" class="btn btn-primary mt-2">Kembali ke Blog</a></div>`;
      }
    } else {
      window.location.href = '/blog.html';
    }
  }

  // Fade-in observer
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => observer.observe(el));
});
