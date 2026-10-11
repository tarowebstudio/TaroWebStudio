/**
 * ============================================================================
 * TaroWeb Studio - Main Script Engine (WhatsApp Direct Integration)
 * File: js/script.js
 * Architecture: Vanilla JS (No External Libraries)
 * Description: Menangani interaksi UI, modal, slider, accordion FAQ, 
 *              animasi scroll, dan pengiriman pesan otomatis ke WhatsApp.
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================
   * 1. CONFIG & DATA PORTOFOLIO
   * ========================================== */
  const APP_CONFIG = {
    scrollOffset: 80,
    autoSlideInterval: 5000,
    // MASUKKAN NOMOR WHATSAPP KAMU DI SINI (Gunakan kode negara 62 tanpa tanda + atau 0)
    whatsappNumber: "6285210601382" 
  };

  const PORTFOLIO_DATA = [
    {
      id: 'proj-1',
      title: 'Resto Gourmet International',
      category: 'Kuliner & Resto',
      description: 'Platform digital lengkap untuk restoran modern dengan sistem reservasi meja online realtime dan integrasi buku menu berbasis QR code.',
      features: [
        'Reservasi meja otomatis dengan konfirmasi WhatsApp',
        'Buku menu digital interaktif dengan filter kategori',
        'Desain ultra-responsive dioptimalkan untuk HP/Mobile',
        'Waktu pemuatan halaman di bawah 2 detik'
      ],
      techStack: ['HTML5', 'CSS Grid', 'Vanilla JavaScript']
    },
    {
      id: 'proj-2',
      title: 'Aura Fashion Store',
      category: 'E-Commerce',
      description: 'Website katalog dan toko online fashion wanita dengan fokus pada kecepatan waktu pemuatan halaman dan kenyamanan navigasi belanja.',
      features: [
        'Katalog produk dinamis dengan filter interaktif',
        'Desain antarmuka modern dan responsif',
        'Optimasi gambar otomatis dengan Lazy Loading',
        'Integrasi tombol pemesanan WhatsApp langsung'
      ],
      techStack: ['HTML5', 'CSS Variables', 'JavaScript ES6']
    },
    {
      id: 'proj-3',
      title: 'DataSync Analytics',
      category: 'SaaS / Tech',
      description: 'Landing page promosi produk software B2B dengan performa sangat tinggi, animasi interaktif yang ringan, dan form perolehan leads.',
      features: [
        'Skor kecepatan Google Lighthouse 95+',
        'Mockup antarmuka interaktif dengan CSS murni',
        'Layout copywriting khusus meningkatkan konversi sales',
        'Formulir pendaftaran dengan validasi langsung'
      ],
      techStack: ['HTML5 Semantic', 'Modern CSS', 'JavaScript']
    }
  ];

  /* ==========================================
   * 2. HELPER UTILITIES
   * ========================================== */
  const $ = (selector, context = document) => context.querySelector(selector);   const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  const debounce = (func, wait = 50) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  /* ==========================================
   * 3. NAVBAR & MOBILE NAVIGATION
   * ========================================== */
  function initNavigation() {
    const navbar = $('#navbar');
    const hamburger = $('#hamburger-btn');
    const navMenu = $('#nav-menu');
    const navLinks = $$('.nav-link');      if (!navbar) return;      // Sticky Navbar saat scroll     const handleScroll = () => {       if (window.scrollY > 40) {         navbar.classList.add('scrolled');       } else {         navbar.classList.remove('scrolled');       }     };      window.addEventListener('scroll', debounce(handleScroll, 10));     handleScroll();      // Toggle Mobile Hamburger Menu     if (hamburger && navMenu) {       hamburger.addEventListener('click', () => {         const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';         hamburger.setAttribute('aria-expanded', !isExpanded);         hamburger.classList.toggle('active');         navMenu.classList.toggle('active');         document.body.classList.toggle('no-scroll');       });        // Tutup menu saat link navigasi diklik       navLinks.forEach(link => {         link.addEventListener('click', () => {           hamburger.classList.remove('active');           navMenu.classList.remove('active');           hamburger.setAttribute('aria-expanded', 'false');           document.body.classList.remove('no-scroll');         });       });     }      // ScrollSpy: Highlight menu aktif sesuai section     const sections = $$('section[id]');
    const highlightActiveNav = () => {
      const scrollY = window.pageYOffset;

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - APP_CONFIG.scrollOffset - 60;
        const sectionId = current.getAttribute('id');
        const navLink = $(`.nav-link[href*="#${sectionId}"]`);

        if (navLink) {
          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(l => l.classList.remove('active'));
            navLink.classList.add('active');
          }
        }
      });
    };

    window.addEventListener('scroll', debounce(highlightActiveNav, 50));
  }

  /* ==========================================
   * 4. SMOOTH SCROLLING
   * ========================================== */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const targetLink = e.target.closest('a[href^="#"]');
      if (!targetLink) return;

      const targetId = targetLink.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = $(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - APP_CONFIG.scrollOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }

  /* ==========================================
   * 5. PORTFOLIO MODAL SYSTEM
   * ========================================== */
  function initPortfolioModal() {
    const modal = $('#portfolio-modal');
    const modalOverlay = $('#modal-overlay');
    const modalClose = $('#modal-close');
    const modalTitle = $('#modal-title');
    const modalCategory = $('#modal-category');
    const modalDesc = $('#modal-description');
    const modalFeatures = $('#modal-features');
    const modalTech = $('#modal-tech');     const detailButtons = $$('.btn-modal');

    if (!modal) return;

    const openModal = (index) => {
      const data = PORTFOLIO_DATA[index];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalDesc.textContent = data.description;

      // Render Fitur Utama
      modalFeatures.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

      // Render Tech Stack
      modalTech.innerHTML = data.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('');

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    };

    const closeModal = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    };

    detailButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.currentTarget.getAttribute('data-project');
        openModal(index);
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Tutup modal dengan tombol Escape keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  /* ==========================================
   * 6. TESTIMONIAL CAROUSEL / SLIDER
   * ========================================== */
  function initTestimonialSlider() {
    const cards = $$('.testimonial-card');     const dots = $$('#slider-dots .dot');
    const prevBtn = $('#prev-testi-btn');
    const nextBtn = $('#next-testi-btn');

    if (cards.length === 0) return;

    let currentIndex = 0;
    let autoPlayTimer = null;

    const renderSlide = (index) => {
      cards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      currentIndex = index;
    };

    const nextSlide = () => {
      const newIndex = (currentIndex + 1) % cards.length;
      renderSlide(newIndex);
    };

    const prevSlide = () => {
      const newIndex = (currentIndex - 1 + cards.length) % cards.length;
      renderSlide(newIndex);
    };

    const startAutoplay = () => {
      stopAutoplay();
      autoPlayTimer = setInterval(nextSlide, APP_CONFIG.autoSlideInterval);
    };

    const stopAutoplay = () => {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoplay();
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        renderSlide(i);
        startAutoplay();
      });
    });

    startAutoplay();

    // Hentikan slider saat hover mouse
    const wrapper = $('.testimonial-slider-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', stopAutoplay);
      wrapper.addEventListener('mouseleave', startAutoplay);
    }
  }

  /* ==========================================
   * 7. FAQ ACCORDION
   * ========================================== */
  function initFaqAccordion() {
    const faqItems = $$('.faq-item');

    faqItems.forEach(item => {
      const header = $('.faq-header', item);
      const body = $('.faq-body', item);

      if (!header || !body) return;

      header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';

        // Tutup item lainnya
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherHeader = $('.faq-header', otherItem);
            const otherBody = $('.faq-body', otherItem);
            if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
            if (otherBody) otherBody.hidden = true;
          }
        });

        // Toggle item yang diklik
        item.classList.toggle('active', !isExpanded);
        header.setAttribute('aria-expanded', !isExpanded);
        body.hidden = isExpanded;
      });
    });
  }

  /* ==========================================
   * 8. CONTACT FORM VALIDATION & WHATSAPP REDIRECT
   * ========================================== */
  function initFormValidation() {
    const form = $('#contact-form');
    if (!form) return;

    const fields = {
      name: $('#name'),
      email: $('#email'),
      business: $('#business_name'),
      service: $('#service_type'),
      message: $('#message')
    };

    const errors = {
      name: $('#name-error'),
      email: $('#email-error'),
      service: $('#service-error'),
      message: $('#message-error')
    };

    const alertBox = $('#form-alert');

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    const showError = (fieldKey, msg) => {
      if (fields[fieldKey]) fields[fieldKey].classList.add('input-error');
      if (errors[fieldKey]) errors[fieldKey].textContent = msg;
    };

    const clearError = (fieldKey) => {
      if (fields[fieldKey]) fields[fieldKey].classList.remove('input-error');
      if (errors[fieldKey]) errors[fieldKey].textContent = '';
    };

    // Live Validation saat mengetik
    Object.keys(fields).forEach(key => {
      if (fields[key]) {
        fields[key].addEventListener('input', () => clearError(key));
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Bersihkan error sebelumnya
      Object.keys(fields).forEach(clearError);

      // Validasi Nama
      if (!fields.name.value.trim()) {
        showError('name', 'Nama lengkap wajib diisi.');
        isValid = false;
      }

      // Validasi Email
      if (!fields.email.value.trim()) {
        showError('email', 'Alamat email wajib diisi.');
        isValid = false;
      } else if (!validateEmail(fields.email.value.trim())) {
        showError('email', 'Format alamat email tidak valid.');
        isValid = false;
      }

      // Validasi Pilihan Service
      if (!fields.service.value) {
        showError('service', 'Silakan pilih jenis website yang dibutuhkan.');
        isValid = false;
      }

      // Validasi Pesan
      if (!fields.message.value.trim()) {
        showError('message', 'Pesan / detail kebutuhan tidak boleh kosong.');
        isValid = false;
      }

      if (isValid) {
        const submitBtn = $('#submit-btn');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengarahkan ke WhatsApp...';

        // Ambil data input
        const nameVal = fields.name.value.trim();
        const emailVal = fields.email.value.trim();
        const businessVal = fields.business.value.trim() || '-';
        const serviceSelect = fields.service.options[fields.service.selectedIndex].text;
        const messageVal = fields.message.value.trim();

        // Format Pesan WhatsApp
        const waText = `Halo Taro Web Studio,%0A%0ASaya ingin berkonsultasi mengenai pembuatan website:%0A%0A` +
          `• *Nama Lengkap*: ${encodeURIComponent(nameVal)}%0A` +
          `• *Email*: ${encodeURIComponent(emailVal)}%0A` +
          `• *Nama Bisnis*: ${encodeURIComponent(businessVal)}%0A` +
          `• *Jenis Website*: ${encodeURIComponent(serviceSelect)}%0A` +
          `• *Detail Pesan*: ${encodeURIComponent(messageVal)}`;

        // Tampilkan pesan sukses sementara di halaman
        if (alertBox) {
          alertBox.className = 'form-alert success';
          alertBox.textContent = '✓ Mengalihkan ke WhatsApp untuk mengirim pesan...';
          alertBox.hidden = false;
        }

        // Buka WhatsApp di Tab Baru setelah 800ms
        setTimeout(() => {
          window.open(`https://wa.me/${APP_CONFIG.whatsappNumber}?text=${waText}`, '_blank');

          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          form.reset();

          if (alertBox) alertBox.hidden = true;
        }, 800);
      }
    });
  }

  /* ==========================================
   * 9. BACK TO TOP BUTTON & SCROLL ANIMATION
   * ========================================== */
  function initScrollAnimations() {
    let backBtn = $('.back-to-top');     if (!backBtn) {       backBtn = document.createElement('button');       backBtn.className = 'back-to-top';       backBtn.setAttribute('aria-label', 'Kembali ke atas');       backBtn.innerHTML = '↑';       document.body.appendChild(backBtn);     }      const toggleBackToTop = () => {       if (window.pageYOffset > 400) {         backBtn.classList.add('visible');       } else {         backBtn.classList.remove('visible');       }     };      window.addEventListener('scroll', debounce(toggleBackToTop, 30));      backBtn.addEventListener('click', () => {       window.scrollTo({         top: 0,         behavior: 'smooth'       });     });      // Reveal Animation on Scroll     const observerOptions = {       root: null,       threshold: 0.1,       rootMargin: '0px 0px -50px 0px'     };      const revealObserver = new IntersectionObserver((entries, observer) => {       entries.forEach(entry => {         if (entry.isIntersecting) {           entry.target.classList.add('animate-in');           observer.unobserve(entry.target);         }       });     }, observerOptions);      const animatableElements = $$('.service-card, .step-card, .portfolio-card, .pricing-card, .team-card, .stat-card');
    animatableElements.forEach(el => {
      el.classList.add('fade-prepare');
      revealObserver.observe(el);
    });
  }

  /* ==========================================
   * 10. INITIALIZATION
   * ========================================== */
  function initApp() {
    initNavigation();
    initSmoothScroll();
    initPortfolioModal();
    initTestimonialSlider();
    initFaqAccordion();
    initFormValidation();
    initScrollAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
