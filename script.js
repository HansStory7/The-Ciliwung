// SELURUH LOGIKA JAVASCRIPT LENGKAP
document.addEventListener('DOMContentLoaded', () => {

    // --- Definisi Variabel Global (di dalam DOMContentLoaded) ---
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
                    <li>Anda akan diarahkan ke formulir online (Microsoft Forms) atau ke Admin WhatsApp kami.</li>
                    <li>Isi formulir atau hubungi tim kami untuk mengonfirmasi ketersediaan dan total biaya.</li>
                    <li>Pembayaran dapat dilakukan melalui transfer bank setelah konfirmasi diterima.</li>
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

     // --- Logika Modal Booking (DIHAPUS KARENA PINDAH KE MS FORMS) ---
     // Semua kode yang berhubungan dengan 'booking-modal', 'booking-form', dll.
     // telah dihapus di versi sebelumnya.


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
    if (window.location.hash) {
        const hash = window.location.hash; // cth: #camping
        
        setTimeout(() => {
            try {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerHeight - 10; // -10px untuk spasi
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth' 
                    });
                    
                    activateLinks(); 
                }
            } catch (e) {
                console.warn("Gagal melakukan auto-scroll ke hash:", e);
            }
        }, 500); // 500ms delay untuk memastikan layout stabil
    }

    // --- [UPDATE] Logika Musik Latar Belakang (Dengan Penyimpanan Waktu) ---
    try {
        // 1. Buat elemen audio
        const audioPlayer = new Audio('background_music.mp3'); // Pastikan file ini ada di server
        audioPlayer.loop = true;
        audioPlayer.volume = 0.3;

        // 2. Buat tombol Play/Pause
        const musicButton = document.createElement('button');
        musicButton.id = 'music-toggle-button';
        musicButton.setAttribute('aria-label', 'Putar/Jeda Musik');
        document.body.appendChild(musicButton);

        // 3. [UPDATE] Simpan status dan WAKTU saat meninggalkan halaman
        window.addEventListener('beforeunload', () => {
            if (audioPlayer) {
                sessionStorage.setItem('musicCurrentTime', audioPlayer.currentTime);
                sessionStorage.setItem('musicIsPlaying', !audioPlayer.paused);
            }
        });

        // 4. [UPDATE] Ambil status dan WAKTU saat halaman dimuat
        const savedTime = parseFloat(sessionStorage.getItem('musicCurrentTime')) || 0;
        let isPlaying = sessionStorage.getItem('musicIsPlaying') === 'true'; // Default ke true jika user ingin
        audioPlayer.currentTime = savedTime; // Atur audio ke waktu yang disimpan

        let userHasInteracted = false;

        // Fungsi untuk update tombol
        const updateButtonState = () => {
            if (isPlaying) {
                musicButton.classList.add('playing');
                musicButton.innerHTML = `<i data-feather="volume-2"></i>`; // Ikon "Playing"
            } else {
                musicButton.classList.remove('playing');
                musicButton.innerHTML = `<i data-feather="volume-x"></i>`; // Ikon "Muted"
            }
            if (typeof feather !== 'undefined') {
                 feather.replace(); // Ganti ikonnya
            }
        };
        
        // Panggil updateButtonState() segera untuk mengatur ikon yang benar saat memuat
        updateButtonState();

        // Fungsi untuk memutar musik
        const playMusic = () => {
            audioPlayer.play().catch(e => console.warn("Autoplay ditolak oleh browser."));
            isPlaying = true;
            sessionStorage.setItem('musicIsPlaying', 'true'); // Simpan status
            updateButtonState();
        };

        // Fungsi untuk menjeda musik
        const pauseMusic = () => {
            audioPlayer.pause();
            isPlaying = false;
            sessionStorage.setItem('musicIsPlaying', 'false'); // Simpan status
            updateButtonState();
        };

        // 5. Coba putar berdasarkan interaksi pengguna pertama kali
        const playOnFirstInteraction = () => {
            if (!userHasInteracted) {
                userHasInteracted = true;
                if (isPlaying) { // Hanya putar jika status terakhir adalah "playing"
                    playMusic();
                }
                // Hapus listener setelah interaksi pertama
                document.removeEventListener('click', playOnFirstInteraction, true);
                document.removeEventListener('keydown', playOnFirstInteraction, true);
            }
        };

        // Tangkap *semua* klik, bahkan yang di-stop (capture phase)
        document.addEventListener('click', playOnFirstInteraction, true);
        document.addEventListener('keydown', playOnFirstInteraction, true);

        // 6. Event listener pada tombol
        musicButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Hentikan event agar tidak memicu playOnFirstInteraction lagi
            userHasInteracted = true; // Klik tombol dihitung sebagai interaksi
            if (isPlaying) {
                pauseMusic();
            } else {
                playMusic();
            }
        });

    } catch (e) {
        console.error("Gagal memuat pemutar musik:", e);
    }
    // --- [AKHIR] Logika Musik Latar Belakang ---


    // Inisialisasi Feather Icons di akhir
     if (typeof feather !== 'undefined') {
         feather.replace();
     }

});

