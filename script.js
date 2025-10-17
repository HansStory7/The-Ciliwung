document.addEventListener('DOMContentLoaded', () => {

    // --- Logika untuk Menu Mobile ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');

    if (mobileMenuButton && mobileMenu && mobileMenuClose) {
        const openMobileMenu = () => mobileMenu.classList.add('active');
        const closeMobileMenu = () => mobileMenu.classList.remove('active');

        mobileMenuButton.addEventListener('click', openMobileMenu);
        mobileMenuClose.addEventListener('click', closeMobileMenu);
        
        // Tutup menu jika link di dalamnya diklik
        mobileMenuLinks.forEach(link => {
            // Cek jika link bukan tombol booking sebelum menambahkan event listener
            if (!link.classList.contains('booking-button')) {
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
            body: `<p>Selamat datang di Thé Ciliwung! Untuk memastikan pengalaman Anda menyenangkan, harap perhatikan panduan berikut:</p>
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
            notificationPopup.textContent = 'Pesan Anda telah terkirim!';
            notificationPopup.classList.add('show');
            setTimeout(() => {
                notificationPopup.classList.remove('show');
            }, 3000); // Sembunyikan setelah 3 detik
        });
    }

    // --- Logika untuk Modal Booking ---
    const bookingModal = document.getElementById('booking-modal');
    const bookingModalClose = document.getElementById('booking-modal-close');
    const bookingButtons = document.querySelectorAll('.booking-button');
    const bookingForm = document.getElementById('booking-form');
    const bookingTypeSelect = document.getElementById('booking-type');
    const backendUrl = 'https://hansstory7.pythonanywhere.com/booking'; // URL Backend Anda

    if (bookingModal && bookingModalClose && bookingButtons.length > 0) {
        
        const openBookingModal = (bookingType = '') => {
            if (bookingType) {
                bookingTypeSelect.value = bookingType;
            }
            bookingModal.classList.add('active');
        };

        const closeBookingModal = () => {
            bookingModal.classList.remove('active');
            bookingForm.reset();
        };

        bookingButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const bookingType = button.getAttribute('data-type');
                openBookingModal(bookingType);
            });
        });

        bookingModalClose.addEventListener('click', closeBookingModal);

        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                closeBookingModal();
            }
        });

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());

            fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                console.log('Success:', result);
                closeBookingModal();
                notificationPopup.textContent = 'Permintaan booking Anda telah terkirim! Admin akan segera menghubungi Anda.';
                notificationPopup.classList.add('show');
                setTimeout(() => {
                    notificationPopup.classList.remove('show');
                    notificationPopup.textContent = 'Pesan Anda telah terkirim!';
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat mengirim permintaan. Silakan coba lagi.');
            });
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

