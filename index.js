fetch('/navbar.html') 
  .then(response => response.text())
  .then(html => {
    const navbarEl = document.getElementById('navbar');
    navbarEl.innerHTML = html;

    // Insert the favicon link tag
    const link = document.createElement('link');
    link.rel = 'shortcut icon';
    link.href = '/assets/profile.jpeg';
    document.head.appendChild(link);
  });