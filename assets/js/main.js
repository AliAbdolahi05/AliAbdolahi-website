// Main interactions and animations (vanilla JS + GSAP)
console.log('Site script loaded');

// Typing effect for hero code block
(function() {
  const el = document.getElementById('typing');
  if(!el) return;
  const txt = `// Hello - I'm Ali
function greet(){
  console.log("Building elegant solutions.");
}
`;
  let i=0;
  el.textContent = '';
  function step() {
    if(i<txt.length) {
      el.textContent += txt[i++];
      setTimeout(step, 18 + Math.random()*30);
    }
  }
  step();
})();

// Theme toggle
(function() {
  const btn = document.getElementById('themeToggle');
  btn && btn.addEventListener('click', ()=>{
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    // simple visual feedback
    btn.textContent = theme === 'dark' ? 'Theme' : 'Theme';
  });
})();

// Simple form handling (برای فرم تماس در index.html)
(function() {
  const form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    msg.textContent = 'Sending...';
    setTimeout(()=>{
      msg.textContent = 'Message sent - I will reply soon.';
      form.reset();
    },900);
  });
})();

// Basic GSAP entrance (انیمیشن ورود کارت‌های پروژه)
(function() {
  if (typeof gsap !== 'undefined'){ /* will animate after projects load */ }
})();

// Shortcut: Ctrl + Alt + A toggle dev console panel
document.addEventListener('keydown', (e)=>{
  if(e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a'){
    alert('Dev panel (easter egg) — Replace with a real console if you want.');
  }
});

// Load GitHub repos and populate project grids (both index.html and projects.html)
(function() {
  const gridMain = document.getElementById('projectGrid');
  if (!gridMain) return;

  const GITHUB_USERNAME = 'AliAbdolahi05'; // <-- your GitHub username
  gridMain.innerHTML = '<p class="text-slate-400">Loading projects from GitHub...</p>';

  fetch('https://api.github.com/users/' + GITHUB_USERNAME + '/repos?sort=updated&direction=desc&per_page=6')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok. Check username.');
      return response.json();
    })
    .then(projects => {
      gridMain.innerHTML = '';
      if (!projects || projects.length === 0) {
        gridMain.innerHTML = '<p class="text-slate-400">No projects found on GitHub.</p>';
        return;
      }

      const limit = window.location.pathname.endsWith('projects.html') ? projects.length : Math.min(3, projects.length);

      const slice = projects.slice(0, limit);
      slice.forEach(p => {
        const a = document.createElement('article');
        a.className = 'project-card p-4 rounded-xl border border-slate-800 bg-gradient-to-b from-black/30 to-transparent';

        const description = p.description ? p.description : 'No description provided.';
        const tags = p.language ? '<span class="tag">' + p.language + '</span>' : '';

        a.innerHTML = `
          <div class="h-36 rounded-md bg-slate-900/40 flex flex-col items-center justify-center p-4 text-center">
            <div class="text-xs text-slate-400">
              ⭐ ${'${p.stargazers_count}'} Stars | Forks: ${'${p.forks_count}'}
            </div>
            <div class="mt-2 text-xs text-slate-500">
              Last updated: ${'${new Date(p.updated_at).toLocaleDateString()}'}
            </div>
          </div>
          <h3 class="mt-4 font-semibold">${'${p.name}'}</h3>
          <p class="text-sm text-slate-400 mt-2 h-16 overflow-hidden">${'${description}'}</p>
          <div class="mt-3 flex items-center gap-2">${'${tags}'}</div>
          <div class="mt-4 flex gap-2">
            <a class="btn-secondary" href="${'${p.html_url}'}" target="_blank" rel="noopener noreferrer">Source</a>
            ${'${p.homepage ? `<a class="btn-secondary" href="${p.homepage}" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}'}
          </div>
        `;
        gridMain.appendChild(a);
      });

      // animate
      if (typeof gsap !== 'undefined') {
        gsap.from('.project-card', {opacity: 0, y: 20, stagger: 0.08, duration: 0.7});
      }
    })
    .catch(error => {
      console.error('Error fetching GitHub projects:', error);
      gridMain.innerHTML = '<p class="text-red-400">Error loading projects. Please check username in main.js and console.</p>';
    });
})();
