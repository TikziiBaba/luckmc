document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GEREKLİ DEĞİŞKENLERİN TANIMLANMASI ---
    const body = document.body;
    const fadeInWords = document.querySelectorAll('.fade-in-scroll span');
    const featuresSection = document.getElementById('ozellikler');

    const totalWords = fadeInWords.length;
    let revealedWordsCount = 0;
    let isLocked = true; // Kaydırmanın kilitli olup olmadığını kontrol eder.
    let lastEventTime = 0; // Çok hızlı kaydırmaları engellemek için.

    // Dokunmatik hareketler için başlangıç pozisyonu
    let touchStartY = 0;

    // --- 2. ÇEKİRDEK ANİMASYON FONKSİYONU ---
    // Bu fonksiyon, kaç kelimenin görüneceğini günceller.
    function updateAnimation() {
        fadeInWords.forEach((span, index) => {
            // Canlanması gereken kelimelere 'revealed' sınıfını ekle.
            if (index < revealedWordsCount) {
                span.classList.add('revealed');
            } else {
                span.classList.remove('revealed');
            }
        });

        // Animasyon bitti mi?
        if (revealedWordsCount >= totalWords) {
            // Eğer kilitliyse, kilidi kaldır.
            if (isLocked) {
                isLocked = false;
                body.classList.remove('scroll-locked');
            }
        } else {
            // Animasyon devam ediyorsa, kilidin aktif olduğundan emin ol.
            if (!isLocked) {
                isLocked = true;
                body.classList.add('scroll-locked');
            }
        }
    }

    // --- 3. KAYDIRMA İŞLEMCİSİ ---
    // Bu fonksiyon, hem fare hem de dokunma için ortak mantığı çalıştırır.
    function processScroll(direction) {
        if (!isLocked) return; // Kilit açıkken hiçbir şey yapma.

        // Aşağı kaydırma hareketi
        if (direction === 'down') {
            if (revealedWordsCount < totalWords) {
                revealedWordsCount++;
            }
        }
        // Yukarı kaydırma hareketi
        else if (direction === 'up') {
            if (revealedWordsCount > 0) {
                revealedWordsCount--;
            }
        }
        
        updateAnimation();
    }

    // --- 4. OLAY DİNLEYİCİLERİ (EVENT LISTENERS) ---

    // Fare Tekerleği için
    function handleWheel(event) {
        if (!isLocked) return;
        event.preventDefault(); // Kilitliyken sayfanın kaymasını engelle.

        const now = Date.now();
        if (now - lastEventTime < 100) return; // Çok hızlı kaydırmaları yoksay.
        lastEventTime = now;

        const direction = event.deltaY > 0 ? 'down' : 'up';
        processScroll(direction);
    }

    // Dokunmatik Başlangıcı için
    function handleTouchStart(event) {
        if (!isLocked) return;
        touchStartY = event.touches[0].clientY;
    }

    // Dokunmatik Bitişi için
    function handleTouchEnd(event) {
        if (!isLocked) return;

        // Dokunmanın bittiği Y pozisyonunu al.
        const touchEndY = event.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;

        // Yeterince uzun bir kaydırma hareketi mi?
        if (Math.abs(deltaY) > 30) {
            const direction = deltaY > 0 ? 'down' : 'up';
            processScroll(direction);
        }
    }

    // Olay dinleyicilerini ekle
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    // Dokunmatik kaydırma sırasında sayfanın hareketini engelle
    window.addEventListener('touchmove', (e) => {
        if (isLocked) e.preventDefault();
    }, { passive: false });


    // --- 5. BAŞLANGIÇ ---
    // Sayfa ilk yüklendiğinde durumu ayarla.
    body.classList.add('scroll-locked');
    updateAnimation();


    // --- IP ADRESİ KOPYALAMA (DEĞİŞİKLİK YOK) ---
    const copyButton = document.getElementById('copy-button');
    const serverIp = document.getElementById('server-ip').textContent;

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(serverIp).then(() => {
            copyButton.innerHTML = '<i class="fa-solid fa-check"></i>';
            copyButton.style.backgroundColor = '#f2e8cf';
            
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fa-solid fa-copy"></i>';
                copyButton.style.backgroundColor = 'var(--primary-green)';
            }, 2000);
        }).catch(err => {
            console.error('IP adresi kopyalanamadı!', err);
        });
    });

    // --- DİĞER BÖLÜMLERİN ANİMASYONU (DEĞİŞİKLİK YOK) ---
    const sections = document.querySelectorAll('.content-section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15
    });

    sections.forEach(section => {
        observer.observe(section);
    });

});
