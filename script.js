document.addEventListener('DOMContentLoaded', () => {

    // --- Logika untuk Menu Mobile ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
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
        slideInterval = setInterval(nextSlide, 4000); // Ganti gambar setiap 4 detik
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    if (slides.length > 0) {
        if (prevButton) prevButton.addEventListener('click', () => {
            prevSlide();
            stopSlideshow();
            startSlideshow();
        });
        if (nextButton) nextButton.addEventListener('click', () => {
            nextSlide();
            stopSlideshow();
            startSlideshow();
        });
        startSlideshow();
    }


    // --- Logika untuk Animasi saat Scroll ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', handleScrollAnimation);
    // Panggil sekali di awal untuk elemen yang sudah terlihat
    handleScrollAnimation();


    // --- Logika untuk Navigasi Aktif saat Scroll ---
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.main-nav a, .mobile-menu a');

    const activateNavLink = () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 100) { 
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            const linkHref = link.getAttribute('href');
            if (currentSectionId && linkHref && linkHref.includes(currentSectionId)) {
                link.classList.add('active-link');
            }
        });
    };
    
    window.addEventListener('scroll', activateNavLink);
    activateNavLink();


    // --- Logika untuk Modal / Popup ---
    const modal = document.getElementById('info-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalButton = document.querySelector('.modal-close');
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    const modalContent = {
        panduan: {
            title: 'Panduan Pengunjung',
            body: `<p>Selamat datang di Thè Ciliwung! Untuk memastikan pengalaman Anda menyenangkan, harap perhatikan panduan berikut:</p>
                   <ul>
                       <li>Check-in dimulai pukul 14:00 dan check-out paling lambat pukul 12:00.</li>
                       <li>Dilarang membawa makanan dan minuman dari luar ke area resto.</li>
                       <li>Harap menjaga kebersihan dan tidak membuang sampah sembarangan.</li>
                       <li>Nyalakan api hanya di area yang telah disediakan.</li>
                   </ul>`
        },
        syarat: {
            title: 'Syarat dan Ketentuan',
            body: `<p>Dengan melakukan pemesanan, Anda setuju dengan syarat dan ketentuan kami:</p>
                   <ul>
                       <li>Pembatalan dalam 7 hari sebelum tanggal kedatangan akan dikenakan biaya penuh.</li>
                       <li>Kami tidak bertanggung jawab atas kehilangan atau kerusakan barang pribadi.</li>
                       <li>Hewan peliharaan tidak diizinkan di area glamping.</li>
                   </ul>`
        },
        kebijakan: {
            title: 'Kebijakan Privasi',
            body: `<p>Kami menghargai privasi Anda. Informasi pribadi yang Anda berikan saat pemesanan hanya akan digunakan untuk keperluan reservasi dan tidak akan dibagikan kepada pihak ketiga tanpa persetujuan Anda.</p>`
        }
    };

    if (modal && closeModalButton && modalTriggers.length > 0) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal-id');
                const content = modalContent[modalId];

                if (content) {
                    modalTitle.textContent = content.title;
                    modalBody.innerHTML = content.body;
                    modal.classList.add('active');
                }
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
        };

        closeModalButton.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // --- Logika untuk Tombol Pesan Mengambang ---
    const floatingButton = document.getElementById('floating-message-button');
    const messageModal = document.getElementById('message-modal');
    const messageModalClose = document.getElementById('message-modal-close');
    const messageForm = document.getElementById('message-form');
    const notificationPopup = document.getElementById('notification-popup');

    if (floatingButton && messageModal && messageModalClose) {
        floatingButton.addEventListener('click', () => {
            messageModal.classList.add('active');
        });

        const closeMessageModal = () => {
            messageModal.classList.remove('active');
        };

        messageModalClose.addEventListener('click', closeMessageModal);
        messageModal.addEventListener('click', (e) => {
            if (e.target === messageModal) {
                closeMessageModal();
            }
        });

        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Di sini Anda bisa menambahkan logika pengiriman data form (misal via AJAX)
            console.log('Formulir terkirim!');
            messageForm.reset();
            closeMessageModal();
            
            // Tampilkan notifikasi
            notificationPopup.classList.add('show');
            setTimeout(() => {
                notificationPopup.classList.remove('show');
            }, 3000); // Sembunyikan setelah 3 detik
        });
    }

    // --- Logika untuk Video Player YouTube ---
    const playButton = document.getElementById('play-button');
    const videoCover = document.getElementById('video-cover');
    const playerFrame = document.getElementById('youtube-player');

    if (playButton && videoCover && playerFrame) {
        playButton.addEventListener('click', () => {
            videoCover.classList.add('hidden');
            playerFrame.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
                '*'
            );
        });
    }

});

