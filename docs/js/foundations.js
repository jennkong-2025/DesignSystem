    const menuButton = document.querySelector('.menu-button');
    const mobilePanel = document.getElementById('mobile-panel');
    const mobileLinks = [...mobilePanel.querySelectorAll('a')];
    const sectionLinks = [...document.querySelectorAll('.section-nav a')];
    const sections = sectionLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    function setMenu(open) {
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      menuButton.textContent = open ? 'Close' : 'Menu';
      mobilePanel.dataset.open = String(open);
      document.body.classList.toggle('nav-open', open);
    }

    menuButton.addEventListener('click', () => {
      setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });
    mobileLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuButton.focus();
      }
    });

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      sectionLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .2, .5] });
    sections.forEach((section) => observer.observe(section));
  
