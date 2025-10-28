// SELURUH LOGIKA JAVASCRIPT LENGKAP
document.addEventListener('DOMContentLoaded', () => {

    // --- Definisi Variabel Global (di dalam DOMContentLoaded) ---
    // Pindahkan definisi ini ke atas agar bisa dipakai oleh fungsi lain
    const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
    const notificationPopup = document.getElementById('notification-popup');


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
            // Tutup jika link adalah anchor di halaman yang sama atau link ke halaman lain
             if (href && (href.startsWith('#') || !href.startsWith('index.html'))) {
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
        // Fallback sederhana jika tidak ada IntersectionObserver
        scrollElements.forEach(el => el.classList.add('is-visible'));
    }


    // --- Logika untuk Navigasi Aktif saat Scroll (Header dan Bottom Nav) ---
    const sections = document.querySelectorAll('main section[id], footer[id]'); // PERBARUI: Sertakan footer
    const headerNavLinks = document.querySelectorAll('.main-nav a'); // Hanya nav header desktop
    const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');
    // headerHeight sudah didefinisikan di atas

    const activateLinks = () => {
        let currentSectionId = '';
        const scrollPosition = window.pageYOffset;
        // const viewportCenter = window.innerHeight / 2; // Tidak dipakai lagi
        const currentPath = window.location.pathname.split('/').pop() || 'index.html'; // Dapatkan nama file saat ini

        // Tentukan section aktif berdasarkan scroll (HANYA jika di index.html)
        if (currentPath === 'index.html' || currentPath === '') {
            
            // --- [PERBAIKAN] Logika Scroll-Spy yang Disederhanakan ---
            currentSectionId = ''; // Mulai kosong
            const scrollThreshold = scrollPosition + headerHeight + 20; // Titik aktivasi (posisi scroll + tinggi header + buffer 20px)

            // Iterasi dari BAWAH ke ATAS untuk menemukan section terakhir yang dilewati
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section.offsetTop <= scrollThreshold) {
                    currentSectionId = section.getAttribute('id');
                    break; // Ditemukan section teratas yang terlihat
                }
            }
            
            // Handle kasus jika di paling atas (sebelum section pertama)
            if (scrollPosition < (sections[0]?.offsetTop - headerHeight - 20 || 300)) {
                 currentSectionId = 'hero';
            }
            
            // Handle kasus di paling bawah (footer)
            if ((window.innerHeight + scrollPosition) >= document.body.offsetHeight - 100) {
                 // Cek ID footer, default ke 'kontak' jika ada
                 const footerSection = document.getElementById('kontak');
                 if(footerSection) currentSectionId = 'kontak';
            }
            // --- [AKHIR PERBAIKAN] ---

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
            const linkTargetFile = linkHref.split('#')[0];
            const linkTargetHash = linkHref.includes('#') ? linkHref.split('#')[1] : null;

            // Logika aktivasi untuk header
            if ((currentPath === 'index.html' || currentPath === '') && linkTargetHash && linkTargetHash === currentSectionId) {
                 link.classList.add('active-link'); // Scroll di index
            } else if ((currentPath === 'index.html' || currentPath === '') && linkTargetHash === 'hero' && currentSectionId === 'hero' && link.textContent === 'Beranda') {
                 link.classList.add('active-link'); // Beranda di index
            }
             else if (linkTargetFile === 'tiket.html' && currentSectionId === 'tiket') {
                 link.classList.add('active-link'); // Link ke tiket.html
             }
             else if (linkTargetFile === 'camp.html' && currentSectionId === 'camping') {
                 link.classList.add('active-link'); // Link ke camp.html
             }
             else if (linkTargetHash === 'galeri' && currentSectionId === 'galeri' && link.textContent === 'Majalah') {
                 link.classList.add('active-link');
             }
             else if (linkTargetHash === 'tiket' && currentSectionId === 'tiket' && link.textContent === 'Tiket Wisata') {
                 link.classList.add('active-link');
             }
             // Tambahkan link aktif untuk kontak
             else if (linkTargetHash === 'kontak' && currentSectionId === 'kontak') {
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

            // Prioritaskan aktivasi berdasarkan halaman saat ini
            if (linkTargetFile === 'tiket.html' && (currentPath === 'tiket.html' || currentSectionId === 'tiket')) {
                 link.classList.add('active'); 
             } else if (linkTargetFile === 'camp.html' && (currentPath.startsWith('camp') || currentSectionId === 'camping')) {
                 link.classList.add('active'); 
             } 
             // Jika kita di index.html, aktifkan berdasarkan scroll section
             else if (currentPath === 'index.html' || currentPath === '') { 
                 if (linkTargetHash && linkTargetHash === currentSectionId) {
                     link.classList.add('active');
                 } else if ((linkTargetHash === 'hero' || linkTargetFile === 'index.html') && currentSectionId === 'hero' && linkText === 'Beranda') {
                     link.classList.add('active');
                 } else if (linkTargetHash === 'galeri' && currentSectionId === 'galeri' && linkText === 'Majalah') {
                      link.classList.add('active');
                 } else if (linkTargetHash === 'resto' && currentSectionId === 'resto' && linkText === 'Resto') {
                      link.classList.add('active');
                 } else if (linkTargetHash === 'tiket' && currentSectionId === 'tiket' && linkText === 'Wisata') {
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


    // --- Logika Modal / Popup Info (DILENGKAPI) ---
     const modal = document.getElementById('info-modal');
     const modalTitle = document.getElementById('modal-title');
     const modalBody = document.getElementById('modal-body');
     const closeModalButton = modal ? modal.querySelector('.modal-close') : null; 
     const modalTriggers = document.querySelectorAll('.modal-trigger');
     
     // ISI KONTEN MODAL
     const modalContent = { 
         panduan: {
            title: "Panduan Pemesanan",
            body: `
                <p><strong>Cara Memesan:</strong></p>
                <ol style="list-style-type: decimal; padding-left: 20px; margin-left: 1rem;">
                    <li>Pilih akomodasi (Camping atau Glamping) yang Anda inginkan.</li>
                    <li>Klik tombol "Pesan Sekarang" atau "Lihat Detail" untuk informasi lebih lanjut.</li>
                    <li>Anda dapat mengisi formulir "Kirim Permintaan Booking" atau menghubungi Admin WhatsApp kami.</li>
                    <li>Tim kami akan mengonfirmasi ketersediaan dan total biaya melalui WhatsApp.</li>
                    <li>Pembayaran dapat dilakukan melalui transfer bank.</li>
                </ol>
                <p style="margin-top: 1rem;"><strong>Check-in & Check-out:</strong></p>
                <ul style="list-style-type: disc; padding-left: 20px; margin-left: 1rem;">
                    <li>Waktu Check-in: 14:00 WIB</li>
                    <li>Waktu Check-out: 12:00 WIB</li>
                </ul>
            `
        },
        syarat: {
            title: "Syarat dan Ketentuan",
            body: `
                <ul style="list-style-type: disc; padding-left: 20px; margin-left: 1rem;">
                    <li>Dilarang membawa minuman keras dan obat-obatan terlarang.</li>
                    <li>Dilarang membuat keributan yang mengganggu kenyamanan tamu lain.</li>
                    <li>Harap menjaga kebersihan area camping/glamping.</li>
                    <li>Api unggun hanya boleh dinyalakan di area yang telah disediakan.</li>
                    <li>Manajemen Thé Ciliwung tidak bertanggung jawab atas kehilangan atau kerusakan barang pribadi tamu.</li>
                    <li>Pembatalan H-7: Pengembalian dana 50%.</li>
                    <li>Pembatalan H-3: Tidak ada pengembalian dana.</li>
                </ul>
            `
        },
        kebijakan: {
            title: "Kebijakan Privasi",
            body: `
                <p>Thé Ciliwung menghargai privasi Anda. Informasi pribadi yang Anda berikan saat pemesanan (nama, email, nomor telepon) hanya akan digunakan untuk keperluan konfirmasi reservasi dan komunikasi layanan.</p>
                <p style="margin-top: 1rem;">Kami tidak akan membagikan, menjual, atau menyewakan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali diwajibkan oleh hukum.</p>
            `
        }
     };
      
      // PASANG EVENT LISTENER
      if (modal && closeModalButton && modalTriggers.length > 0 && modalTitle && modalBody) { 
          modalTriggers.forEach(trigger => {
              trigger.addEventListener('click', (e) => {
                   e.preventDefault(); // Mencegah link # beraksi
                   const modalId = trigger.getAttribute('data-modal-id');
                   const content = modalContent[modalId];

                   if (content) {
                       modalTitle.textContent = content.title;
                       modalBody.innerHTML = content.body;
                       modal.classList.add('active'); // Tampilkan modal
                   }
              });
          });
          
          const closeModal = () => modal.classList.remove('active');
          closeModalButton.addEventListener('click', closeModal);
          modal.addEventListener('click', (e) => { 
              if (e.target === modal) closeModal(); 
          });
      }


    // --- Logika Modal Pesan ---
     const floatingButton = document.getElementById('floating-message-button');
     const messageModal = document.getElementById('message-modal');
     const messageModalClose = messageModal ? messageModal.querySelector('#message-modal-close') : null; 
     const messageForm = document.getElementById('message-form');
     // notificationPopup sudah didefinisikan di atas
      
      if (floatingButton && messageModal && messageModalClose && messageForm && notificationPopup) { 
          floatingButton.addEventListener('click', () => messageModal.classList.add('active'));
          const closeMessageModal = () => messageModal.classList.remove('active');
          messageModalClose.addEventListener('click', closeMessageModal);
          messageModal.addEventListener('click', (e) => { if (e.target === messageModal) closeMessageModal(); });
          
          messageForm.addEventListener('submit', (e) => { 
              e.preventDefault();
              // Logika submit form di sini (misal: kirim ke backend)
              console.log('Form pesan dikirim');
              closeMessageModal();
              notificationPopup.textContent = 'Pesan Anda telah terkirim!';
              notificationPopup.style.backgroundColor = ''; // Reset jika sebelumnya error
              notificationPopup.classList.add('show');
              setTimeout(() => {
                  notificationPopup.classList.remove('show');
              }, 3000);
          });
      } else { 
          console.warn("Elemen modal pesan tidak ditemukan di halaman ini."); 
      }

     // --- Logika Modal Booking (GLOBAL) ---
     const bookingModal = document.getElementById('booking-modal');
     const bookingModalClose = bookingModal ? bookingModal.querySelector('#booking-modal-close') : null; 
     const bookingButtons = document.querySelectorAll('.booking-button'); // Tombol umum
     const directBookingButtons = document.querySelectorAll('.booking-button-direct'); // Tombol di halaman camp.html
     const bookingForm = document.getElementById('booking-form');
     const bookingTypeSelect = document.getElementById('booking-type');
      
      if (bookingModal && bookingModalClose && (bookingButtons.length > 0 || directBookingButtons.length > 0) && bookingForm && bookingTypeSelect && notificationPopup) { 
           
           const openBookingModal = (bookingType = '') => {
               if (bookingTypeSelect) {
                   bookingTypeSelect.value = bookingType; // Set dropdown
               }
               if (bookingModal) {
                   bookingModal.classList.add('active');
               }
           };

           const closeBookingModal = () => {
               if (bookingModal) {
                   bookingModal.classList.remove('active');
               }
               if (bookingForm) {
                   bookingForm.reset();
               }
           };
           
           // Listener untuk tombol "Pesan Sekarang" umum
           bookingButtons.forEach(button => {
               button.addEventListener('click', (e) => {
                   e.preventDefault();
                   const bookingType = button.getAttribute('data-type') || '';
                   openBookingModal(bookingType);
               });
           });
           
           // Listener untuk tombol di halaman camp.html (jika ada)
           directBookingButtons.forEach(button => {
               button.addEventListener('click', (e) => {
                   e.preventDefault();
                   const bookingType = button.getAttribute('data-type');
                   openBookingModal(bookingType);
               });
           });
           
           if(bookingModalClose) bookingModalClose.addEventListener('click', closeBookingModal);
           bookingModal.addEventListener('click', (e) => { 
               if (e.target === bookingModal) closeBookingModal(); 
           });
           
           // Logika Submit Form Booking
           bookingForm.addEventListener('submit', (e) => {
               e.preventDefault();
               const formData = new FormData(bookingForm);
               const data = Object.fromEntries(formData.entries());
               const backendUrl = 'https://hansstory7.pythonanywhere.com/booking'; // URL Backend

                fetch(backendUrl, { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
                .then(response => {
                     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                     return response.json();
                 })
                .then(result => {
                    console.log('Success:', result);
                    closeBookingModal();
                    notificationPopup.textContent = 'Permintaan booking terkirim! Admin akan menghubungi Anda via WhatsApp.';
                    notificationPopup.style.backgroundColor = ''; // Reset
                    notificationPopup.classList.add('show');
                    setTimeout(() => {
                        notificationPopup.classList.remove('show');
                    }, 5000); // Tampilkan 5 detik
                })
                .catch(error => {
                    console.error('Error:', error);
                     notificationPopup.textContent = 'Gagal mengirim booking! Coba lagi.';
                     notificationPopup.style.backgroundColor = 'red'; // Tanda error
                     notificationPopup.classList.add('show');
                     setTimeout(() => {
                         notificationPopup.classList.remove('show');
                         notificationPopup.style.backgroundColor = ''; // Reset
                     }, 4000);
                });
           });
      } else { 
          console.warn("Elemen modal booking tidak ditemukan di halaman ini atau tombol booking tidak ada."); 
      }

    // --- Logika Video Player YouTube ---
     const playButton = document.getElementById('play-button');
     const videoCover = document.getElementById('video-cover');
     const playerFrame = document.getElementById('youtube-player');
     let player; 
      
      // Muat API YouTube Iframe
      window.onYouTubeIframeAPIReady = function() { 
          if (playerFrame) {
              player = new YT.Player('youtube-player', {
                  events: {
                      'onReady': onPlayerReady
                  }
              });
          } 
      }
      
      function onPlayerReady(event) {
          // Player siap
      }

      if (playerFrame) { 
          const tag = document.createElement('script'); 
          tag.src = "https://www.youtube.com/iframe_api"; 
          const firstScriptTag = document.getElementsByTagName('script')[0]; 
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); 
      }
      
      if (playButton && videoCover && playerFrame) { 
          playButton.addEventListener('click', () => {
              if (videoCover) videoCover.classList.add('hidden');
              if (player && typeof player.playVideo === 'function') {
                  player.playVideo();
              }
          });
      }

    // --- [SOLUSI] Logika untuk Scroll ke Hash Saat Pindah Halaman ---
    // Cek jika URL memiliki hash (cth: index.html#camping)
    // Ini harus dijalankan setelah semua logika lain didefinisikan
    if (window.location.hash) {
        const hash = window.location.hash; // cth: #camping
        
        // Beri sedikit waktu agar semua gambar (terutama slideshow) dimuat
        // dan layout stabil sebelum mencoba scroll.
        setTimeout(() => {
            try {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    // Dapatkan tinggi header (sudah didefinisikan di atas)
                    // Hitung posisi scroll
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerHeight - 10; // -10px untuk spasi
                    
                    // Lakukan scroll manual
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth' 
                    });
                    
                    // Paksa update link aktif setelah scroll
                    activateLinks(); 
                }
            } catch (e) {
                console.warn("Gagal melakukan auto-scroll ke hash:", e);
            }
        }, 500); // 500ms delay untuk memastikan layout stabil
    }
    // --- [AKHIR SOLUSI] ---


    // Inisialisasi Feather Icons di akhir
     if (typeof feather !== 'undefined') {
         feather.replace();
     }

});
