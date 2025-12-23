document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    // Mobile menu toggle + accessibility
    if (menuToggle && navLinks) {
        const toggleMenu = () => navLinks.classList.toggle('active');

        menuToggle.addEventListener('click', toggleMenu);
        menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        // Close menu with Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') navLinks.classList.remove('active');
        });

        // Close menu on link click and smooth scroll to section
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', (e) => {
                const href = a.getAttribute('href') || '';
                if (href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
                navLinks.classList.remove('active');
            });
        });
    }

    // Active nav link on scroll — use IntersectionObserver with fallback
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navLinkItems = Array.from(document.querySelectorAll('.nav-links a'));

    if (sections.length && navLinkItems.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                if (!id) return;
                const link = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (!link) return;
                if (entry.isIntersecting) {
                    navLinkItems.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        }, { root: null, rootMargin: '0px 0px -45% 0px', threshold: 0 });

        sections.forEach(s => observer.observe(s));
    } else {
        // fallback: throttle scroll handler
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    let current = '';
                    sections.forEach(section => {
                        const top = section.getBoundingClientRect().top;
                        if (top <= window.innerHeight * 0.33) current = section.id;
                    });
                    navLinkItems.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Contact form handling with validation and send-safety
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    if (contactForm) {
        let isSending = false;
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (isSending) return;

            const nameEl = document.getElementById('name');
            const emailEl = document.getElementById('email');
            const messageEl = document.getElementById('message');
            const name = nameEl ? nameEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim() : '';
            const message = messageEl ? messageEl.value.trim() : '';

            const setStatus = (text, color) => {
                if (formStatus) {
                    formStatus.textContent = text;
                    formStatus.style.color = color || '';
                }
            };

            if (!name || !email || !message) {
                setStatus('Please fill out all fields.', 'red');
                return;
            }

            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRe.test(email)) {
                setStatus('Please enter a valid email.', 'red');
                return;
            }

            isSending = true;
            setStatus('Sending...');

            try {
                // Replace this with an actual fetch() call to your backend if available
                await new Promise(res => setTimeout(res, 800));
                setStatus('Message sent — thank you!', 'green');
                contactForm.reset();
            } catch (err) {
                setStatus('Failed to send message. Please try again later.', 'red');
            } finally {
                isSending = false;
            }
        });
    }
});
