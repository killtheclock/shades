function toggleMenu(){
  document.getElementById('menu').classList.toggle('open');
}
function go(){
  document.getElementById('menu').classList.remove('open');
}

// Load and render Markdown content
fetch('content.md')
  .then(response => {
    if (!response.ok) throw new Error('Content not found');
    return response.text();
  })
  .then(text => {
    // Convert Markdown to HTML
    const html = marked.parse(text);

    // Inject into main, and add proper IDs for anchor links
    const main = document.getElementById('content');
    main.innerHTML = html;

    // Automatically add IDs to headings so menu links work
    document.querySelectorAll('h2, h3').forEach(heading => {
      const text = heading.textContent.trim()
        .toLowerCase()
        .replace(/[^\w]+/g, '-')
        .replace(/^-+|-+$/g, '');
      heading.id = text;
    });
  })
  .catch(err => {
    document.getElementById('content').innerHTML = '<p style="color:red;">Error loading content: ' + err.message + '</p>';
  });

window.addEventListener('scroll', () => {
  const footer = document.getElementById('page-footer');
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
    footer.style.display = 'block';
  }
});

// Κάνει smooth scroll και centering του τίτλου στο κέντρο της οθόνης
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // Σταματάει το default jump

    const targetId = this.getAttribute('href'); // π.χ. #tyrant
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      // Υπολογίζει τη θέση ώστε το heading να είναι στο κέντρο
      const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offset = elementTop - (window.innerHeight / 2) + (targetElement.offsetHeight / 2);

      window.scrollTo({
        top: offset,
        behavior: 'smooth' // Ομαλό scroll
      });
    }

    // Κλείνει το menu (όπως ήδη κάνει το go())
    document.getElementById('menu').classList.remove('open');
  });
});