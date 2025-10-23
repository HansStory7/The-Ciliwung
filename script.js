document.addEventListener('DOMContentLoaded', () => {

    // --- Logika untuk Menu Mobile ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : []; // Cek null

    const openMobileMenu = () => {
        if(mobileMenu) mobileMenu.classList.add('active');
        if(mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
    };

    const closeMobileMenu = () => {
        if(mobileMenu) mobileMenu.classList.remove('active');
        if(mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
    };

    if (mobileMenuButton && mobileMenu && mobileMenuClose && mobileMenuOverlay) {
        mobileMenuButton.addEventListener('click', openMobileMenu);
        mobileMenuClose.addEventListener('click', closeMobileMenu);
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        mobileMenuLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Hanya tutup jika link BUKAN ke halaman lain (mulai dengan # atau hanya index.html#)
             if (href && (href.startsWith('#') || href.startsWith('index.html#') || href === 'index.html')) {
                 link.addEventListener('click', closeMobileMenu); 
            }
        });
    }

    // --- Logika untuk Slideshow di Hero Section ---
    const slides = document.querySelectorAll('.hero-background');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startSlideshow() {
        if (slides.length > 1) {
            slideInterval = setInterval(nextSlide, 4000); 
        }
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    if (slides.length > 1) { 
        if (prevButton) prevButton.addEventListener('click', () => { prevSlide(); stopSlideshow(); startSlideshow(); });
        if (nextButton) nextButton.addEventListener('click', () => { nextSlide(); stopSlideshow(); startSlideshow(); });
        startSlideshow(); 
    } else if (slides.length === 1) {
        showSlide(0); 
        if (prevButton) prevButton.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
    }


    // --- Logika untuk Animasi saat Scroll ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // observer.unobserve(entry.target); // Uncomment jika animasi hanya sekali
                } else {
                    // entry.target.classList.remove('is-visible'); // Uncomment jika animasi berulang
                }
            });
        }, { threshold: 0.1 }); 
        scrollElements.forEach(el => observer.observe(el));
    } else {
        // Fallback
        const elementInView = (el, dividend = 1) => { /* ... (fallback logic) ... */ };
        const displayScrollElement = (element) => element.classList.add('is-visible');
        const handleScrollAnimation = () => { /* ... (fallback logic) ... */ };
        window.addEventListener('scroll', handleScrollAnimation);
        handleScrollAnimation(); 
    }


    // --- Logika untuk Navigasi Aktif saat Scroll (Header dan Bottom Nav) ---
    const sections = document.querySelectorAll('main section[id]'); 
    const headerNavLinks = document.querySelectorAll('.main-nav a'); // Hanya nav header desktop
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');
    const headerHeight = document.querySelector('.header')?.offsetHeight || 70; 

    const activateLinks = () => {
        let currentSectionId = '';
        const scrollPosition = window.pageYOffset;
        const viewportCenter = window.innerHeight / 2;
        const currentPath = window.location.pathname.split('/').pop() || 'index.html'; // Dapatkan nama file saat ini

        // Tentukan section aktif berdasarkan scroll (HANYA jika di index.html)
        if (currentPath === 'index.html') {
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 10; // Beri sedikit offset tambahan
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                 if ((sectionTop < scrollPosition + viewportCenter / 2 && sectionTop + sectionHeight > scrollPosition + viewportCenter / 2) || 
                     (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight))
                 {
                    currentSectionId = sectionId;
                 }
            });
             
             if (!currentSectionId && scrollPosition < (sections[0]?.offsetTop - headerHeight - 10 || 300)) {
                  currentSectionId = 'hero'; 
             }
             else if (!currentSectionId && (window.innerHeight + scrollPosition) >= document.body.offsetHeight - 100) {
                 const kontakSection = document.getElementById('kontak');
                 if(kontakSection) currentSectionId = 'kontak';
             }

        } else {
             // Jika bukan di index, tentukan ID aktif berdasarkan file
             if (currentPath === 'tiket.html') currentSectionId = 'tiket'; 
             else if (currentPath.startsWith('camp')) currentSectionId = 'camping'; 
             else if (currentPath.startsWith('resto')) currentSectionId = 'resto';
        }

        
        // --- Aktivasi Link Navigasi Header (Desktop) ---
        headerNavLinks.forEach(link => {
            link.classList.remove('active-link');
            const linkHref = link.getAttribute('href');
            const linkTargetHash = linkHref.includes('#') ? linkHref.split('#')[1] : null;

            // Header di desktop HANYA link internal #hash ke index.html
            if (currentPath === 'index.html' && linkTargetHash && linkTargetHash === currentSectionId) {
                 link.classList.add('active-link');
            } else if (currentPath === 'index.html' && !linkTargetHash && currentSectionId === 'hero' && link.textContent === 'Beranda') {
                 link.classList.add('active-link');
            }
             // Handle kasus Majalah -> #galeri
             else if (currentPath === 'index.html' && linkTargetHash === 'galeri' && currentSectionId === 'galeri' && link.textContent === 'Majalah') {
                 link.classList.add('active-link');
             }
             // Handle kasus Tiket -> #tiket (BARU DITAMBAHKAN KEMBALI)
              else if (currentPath === 'index.html' && linkTargetHash === 'tiket' && currentSectionId === 'tiket' && link.textContent === 'Tiket Wisata') {
                 link.classList.add('active-link');
             }
        });

        // --- Aktivasi Link Navigasi Bawah (Mobile) ---
        bottomNavLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            const linkTargetFile = linkHref.split('#')[0];
            const linkTargetHash = linkHref.includes('#') ? linkHref.split('#')[1] : null;
            const linkText = link.querySelector('span')?.textContent || ''; 

            // Prioritaskan aktivasi berdasarkan halaman saat ini jika link mengarah ke halaman lain
            if (linkTargetFile === 'tiket.html' && currentPath === 'tiket.html') {
                 link.classList.add('active'); 
             } else if (linkTargetFile === 'camp.html' && currentPath.startsWith('camp')) { // Mencakup camp.html, camp1, dll
                 link.classList.add('active'); 
             } 
             // Jika kita di index.html, aktifkan berdasarkan scroll section
             else if (currentPath === 'index.html') { 
                 if (linkTargetHash && linkTargetHash === currentSectionId) {
                     link.classList.add('active');
                 } else if (linkTargetHash === 'hero' && currentSectionId === 'hero' && linkText === 'Beranda') {
                     link.classList.add('active');
                 } else if (linkTargetHash === 'galeri' && currentSectionId === 'galeri' && linkText === 'Majalah') {
                      link.classList.add('active');
                 } else if (linkTargetHash === 'tiket' && currentSectionId === 'tiket' && linkText === 'Wisata') { // Aktifkan Wisata (#tiket)
                      link.classList.add('active');
                 }
             }
        });
    };
    
    // Optimasi scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(activateLinks, 50); 
    });
    window.addEventListener('load', activateLinks);
    window.addEventListener('hashchange', activateLinks); 


    // --- Logika Modal / Popup Info ---
     const modal = document.getElementById('info-modal');
     const modalTitle = document.getElementById('modal-title');
     const modalBody = document.getElementById('modal-body');
     const closeModalButton = modal ? modal.querySelector('.modal-close') : null; 
     const modalTriggers = document.querySelectorAll('.modal-trigger');
     const modalContent = { 
         panduan: { /*...*/ },
         syarat: { /*...*/ },
         kebijakan: { /*...*/ }
     };
      if (modal && closeModalButton && modalTriggers.length > 0) { 
          modalTriggers.forEach(trigger => { /* ... listener ... */ });
          const closeModal = () => modal.classList.remove('active');
          closeModalButton.addEventListener('click', closeModal);
          modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
      }

    // --- Logika Modal Pesan ---
     const floatingButton = document.getElementById('floating-message-button');
     const messageModal = document.getElementById('message-modal');
     const messageModalClose = messageModal ? messageModal.querySelector('#message-modal-close') : null; 
     const messageForm = document.getElementById('message-form');
     const notificationPopup = document.getElementById('notification-popup');
      if (floatingButton && messageModal && messageModalClose && messageForm && notificationPopup) { 
          floatingButton.addEventListener('click', () => messageModal.classList.add('active'));
          const closeMessageModal = () => messageModal.classList.remove('active');
          messageModalClose.addEventListener('click', closeMessageModal);
          messageModal.addEventListener('click', (e) => { if (e.target === messageModal) closeMessageModal(); });
          messageForm.addEventListener('submit', (e) => { /* ... listener submit ... */ });
      } else { console.error("Elemen modal pesan tidak ditemukan semua."); }

     // --- Logika Modal Booking ---
     const bookingModal = document.getElementById('booking-modal');
     const bookingModalClose = bookingModal ? bookingModal.querySelector('#booking-modal-close') : null; 
     const bookingButtons = document.querySelectorAll('.booking-button'); 
     const directBookingButtons = document.querySelectorAll('.booking-button-direct'); 
     const bookingForm = document.getElementById('booking-form');
     const bookingTypeSelect = document.getElementById('booking-type');
      if (bookingModal && bookingModalClose && (bookingButtons.length > 0 || directBookingButtons.length > 0) && bookingForm && bookingTypeSelect && notificationPopup) { 
           const openBookingModal = (bookingType = '') => { /* ... fungsi open ... */ };
           const closeBookingModal = () => { /* ... fungsi close ... */ };
           bookingButtons.forEach(button => { /* ... listener ... */ });
           directBookingButtons.forEach(button => { /* ... listener ... */ });
           bookingModalClose.addEventListener('click', closeBookingModal);
           bookingModal.addEventListener('click', (e) => { if (e.target === bookingModal) closeBookingModal(); });
           bookingForm.addEventListener('submit', (e) => { /* ... listener submit ... */ });
      } else { console.warn("Elemen modal booking tidak ditemukan di halaman ini atau tombol booking tidak ada."); }

    // --- Logika Video Player YouTube ---
     const playButton = document.getElementById('play-button');
     const videoCover = document.getElementById('video-cover');
     const playerFrame = document.getElementById('youtube-player');
     let player; 
      window.onYouTubeIframeAPIReady = function() { if (playerFrame) player = new YT.Player('youtube-player', {}); }
      if (playerFrame) { const tag=document.createElement('script'); tag.src="https://www.youtube.com/iframe_api"; const ft=document.getElementsByTagName('script')[0]; ft.parentNode.insertBefore(tag, ft); }
      if (playButton && videoCover && playerFrame) { /* ... logika event listener video player ... */ }

    // Inisialisasi Feather Icons di akhir
     if (typeof feather !== 'undefined') {
         feather.replace();
     }

});

