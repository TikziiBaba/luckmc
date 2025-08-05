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
            // Eğer durum 'animating' ise, 'finished' durumuna geçir.
            if (lockState === 'animating') {
                lockState = 'finished';
            }
        } else {
            // Eğer tüm kelimeler canlanmadıysa, durumun 'animating' olduğundan emin ol.
            lockState = 'animating';
            if (!body.classList.contains('scroll-locked')) {
                body.classList.add('scroll-locked');
            }
        }
    }

    // --- FARE TEKERLEĞİ OLAY YÖNETİCİSİ ---
    window.addEventListener('wheel', (event) => {
        // Animasyonun çok hızlı ilerlemesini engellemek için bir bekleme süresi koy.
        const now = Date.now();
        if (now - lastAnimationTime < 50) { // 50 milisaniyeden daha hızlı tetiklenemez.
            event.preventDefault(); // Engellenen kaydırmaların da varsayılan davranışı durdurulmalı.
            return;
        }
        
        // Eğer durum 'animating' ise, animasyonu ilerlet.
        if (lockState === 'animating') {
            event.preventDefault(); // Sayfanın normal kaymasını engelle
            lastAnimationTime = now;

            if (event.deltaY > 0) { // Aşağı kaydırma
                if (revealedWordsCount < totalWords) revealedWordsCount++;
            } else { // Yukarı kaydırma
                if (revealedWordsCount > 0) revealedWordsCount--;
            }
            updateWordAnimation();
        } 
        // Eğer durum 'finished' ise, bu ilk kaydırma kilidi açar.
        else if (lockState === 'finished') {
            event.preventDefault(); // Bu ilk kaydırmanın sayfayı hareket ettirmesini engelle.
            lockState = 'unlocked';
            body.classList.remove('scroll-locked');
        }
        // Eğer durum 'unlocked' ise, hiçbir şey yapma, tarayıcı normal kaydırsın.

    }, { passive: false }); // event.preventDefault() kullanabilmek için bu gereklidir.


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
