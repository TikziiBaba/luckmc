document.addEventListener('DOMContentLoaded', () => {

    // --- DEĞİŞKENLER ---
    const body = document.body;
    const fadeInWords = document.querySelectorAll('.fade-in-scroll span');
    const featuresSection = document.getElementById('ozellikler');

    const totalWords = fadeInWords.length;
    let revealedWordsCount = 0;
    
    // Animasyon durumunu takip etmek için bir durum makinesi
    // 'animating': Giriş animasyonu aktif, kaydırma kilitli.
    // 'finished': Animasyon bitti, bir sonraki kaydırmayı bekliyor, kaydırma kilitli.
    // 'unlocked': Kilit açıldı, normal sayfa kaydırması aktif.
    let lockState = 'animating'; 
    
    let lastAnimationTime = 0; // Animasyonun çok hızlı tetiklenmesini engeller

    // --- ANİMASYON GÜNCELLEME FONKSİYONU ---
    function updateWordAnimation() {
        // Her bir kelimeyi (span) kontrol et ve canlandır
        fadeInWords.forEach((span, index) => {
            if (index < revealedWordsCount) {
                span.classList.add('revealed');
            } else {
                span.classList.remove('revealed');
            }
        });

        // Tüm kelimeler canlandı mı?
        if (revealedWordsCount >= totalWords) {
            if (lockState === 'animating') {
                lockState = 'finished';
            }
        } else {
            lockState = 'animating';
            if (!body.classList.contains('scroll-locked')) {
                body.classList.add('scroll-locked');
            }
        }
    }

    // --- YENİ: Ortak Kaydırma Mantığı İşleyicisi ---
    function processScroll(direction) {
        // Animasyonun çok hızlı ilerlemesini engellemek için bir bekleme süresi koy.
        const now = Date.now();
        if (now - lastAnimationTime < 50) { 
            return;
        }
        lastAnimationTime = now;

        if (lockState === 'animating') {
            if (direction === 'down') { // Aşağı kaydırma / Yukarı kaydırma (parmak)
                if (revealedWordsCount < totalWords) revealedWordsCount++;
            } else { // Yukarı kaydırma / Aşağı kaydırma (parmak)
                if (revealedWordsCount > 0) revealedWordsCount--;
            }
            updateWordAnimation();
        }
    }

    // --- FARE TEKERLEĞİ OLAY YÖNETİCİSİ ---
    window.addEventListener('wheel', (event) => {
        if (lockState === 'unlocked') return;
        event.preventDefault();

        if (lockState === 'finished') {
            lockState = 'unlocked';
            body.classList.remove('scroll-locked');
            return;
        }
        
        const direction = event.deltaY > 0 ? 'down' : 'up';
        processScroll(direction);

    }, { passive: false });

    // --- YENİ: DOKUNMATİK EKRAN OLAY YÖNETİCİLERİ ---
    let touchStartY = 0;
    let touchEndY = 0;

    window.addEventListener('touchstart', (event) => {
        if (lockState === 'unlocked') return;
        // Dokunmanın başlangıç Y pozisyonunu kaydet
        touchStartY = event.touches[0].clientY;
    }, { passive: false });

    window.addEventListener('touchmove', (event) => {
        if (lockState === 'unlocked') return;
        event.preventDefault(); // Dokunmatik kaydırmayı her zaman engelle
        // Dokunmanın sonlandığı Y pozisyonunu sürekli güncelle
        touchEndY = event.touches[0].clientY;
    }, { passive: false });

    window.addEventListener('touchend', () => {
        if (lockState === 'unlocked') return;

        // Eğer animasyon bittiyse, bu ilk dokunma kilidi açar.
        if (lockState === 'finished') {
            lockState = 'unlocked';
            body.classList.remove('scroll-locked');
            return;
        }

        // Başlangıç ve bitiş arasındaki farkı hesapla
        const touchDelta = touchStartY - touchEndY;
        
        // Dokunma mesafesi yeterince büyükse (bir "swipe" ise) işlemi tetikle
        if (Math.abs(touchDelta) > 50) { 
            const direction = touchDelta > 0 ? 'down' : 'up';
            processScroll(direction);
        }
    }, { passive: false });


    // Sayfa ilk yüklendiğinde animasyonun başlangıç durumunu ayarla
    body.classList.add('scroll-locked');
    updateWordAnimation();


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
