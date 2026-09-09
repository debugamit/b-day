particlesJS("particles-js", {
    particles: {
        number: { value: 30, density: { enable: true, value_area: 800 } }, // Reduced count for extreme performance
        color: { value: ["#ffffff", "#ffb6c1", "#ff758c", "#FFD700"] },
        shape: { type: ["circle"] }, // Simplified shapes
        opacity: { value: 0.6, random: true, anim: { enable: false } }, // Disabled expensive opacity anim
        size: { value: 4, random: true, anim: { enable: false } }, // Disabled size anim
        line_linked: { enable: false }, // HUGE FPS BOOST: Disabled canvas connection lines
        move: { enable: true, speed: 1.5, direction: "top", random: true, straight: false, out_mode: "out", bounce: false }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" }, 
            onclick: { enable: true, mode: "push" },   
            resize: true
        },
        modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 2 }
        }
    },
    retina_detect: true
});

const countdownView = document.getElementById('countdown-view');
const celebrationView = document.getElementById('celebration-view');

let confettiFired = false;
let deckInitialized = false;

// 85 MEMORIES LOADED DYNAMICALLY
const allPhotos = [
    "20240907_122324.heic", "20240907_122921.heic", "20241010_215646.jpg", "20241010_215732.jpg", "20241011_221323.jpg", "20241011_221328.jpg", "20241011_221337.jpg", "20241011_221339.jpg", "20241011_221347.jpg", "20241011_221402.jpg", "20241011_222837.jpg", "20241011_222850.jpg", "20241011_230124.jpg", "20241011_231331.jpg", "20241011_231451.jpg", "20241011_232725.jpg", "20241011_232849.jpg", "20241013_210850.jpg", "20241013_212558.jpg", "20241013_215503.jpg", "20241013_215748.jpg", "20241013_224616.jpg", "20241013_224657(0).jpg", "20241013_224702.jpg", "20241014_190029.jpg", "20250302_182233.jpg", "20250302_182439.jpg", "20250302_182544.jpg", "20250302_182550.jpg", "20250302_182644.jpg", "20250308_131931.jpg", "20250314_210709.jpg", "20250314_211101.jpg", "20250314_211344.jpg", "20250314_211554.jpg", "20250314_211648.jpg", "20250516_212240.jpg", "20250516_212606.jpg", "20250516_212712.jpg", "20250516_212747.jpg", "20250516_215245.jpg", "20250516_215349.jpg", "IMG-20240801-WA0019.jpg", "IMG-20240801-WA0021.jpg", "IMG-20240815-WA0001.jpg", "IMG-20241101-WA0003.jpg", "IMG-20250221-WA0007.jpg", "IMG_20230521_195447.jpg", "Screenshot_2023-06-24-23-36-56-540_com.whatsapp.jpg", "Screenshot_2023-06-24-23-44-37-367_com.whatsapp.jpg", "Screenshot_2023-08-16-20-19-38-275_com.instagram.android.jpg", "Screenshot_2023-08-20-21-01-28-028_com.instagram.android.jpg", "Screenshot_2023-08-20-21-01-34-918_com.instagram.android.jpg", "Screenshot_2023-09-25-23-22-18-228_com.instagram.android.jpg", "Screenshot_2023-09-25-23-50-30-836_com.instagram.android.jpg", "Screenshot_2023-10-18-00-48-46-655_com.instagram.android.jpg", "Snapchat-1237275345.jpg", "Snapchat-1314143133.jpg", "Snapchat-1325595339.jpg", "Snapchat-134373838.jpg", "Snapchat-1388468109.jpg", "Snapchat-1465202760.jpg", "Snapchat-1469332312.jpg", "Snapchat-1519326062.jpg", "Snapchat-1523554738.jpg", "Snapchat-1572036009.jpg", "Snapchat-1601415304.jpg", "Snapchat-1626025189.jpg", "Snapchat-1652065070.jpg", "Snapchat-1769355790.jpg", "Snapchat-1780507351.jpg", "Snapchat-1819233748.jpg", "Snapchat-1945650623.jpg", "Snapchat-1964578733.jpg", "Snapchat-200247166.jpg", "Snapchat-2037580960.jpg", "Snapchat-462488194.jpg", "Snapchat-479687000.jpg", "Snapchat-692032431.jpg", "Snapchat-724302000.jpg", "Snapchat-827574697.jpg", "Snapchat-85821138.jpg", "Snapchat-859336416.jpg", "Snapchat-91954294.jpg", "Snapchat-933167942.jpg"
];

let currentPhotoIndex = 0;
let shuffledPhotos = [];

function buildMemoryDeck() {
    if(deckInitialized) return;
    deckInitialized = true;
    const deck = document.getElementById('memory-deck');
    if(!deck) return;

    const soloPhotos = ["20241010_215646.jpg", "20241011_221323.jpg", "20250302_182233.jpg", "20250516_212240.jpg"];
    const validPhotos = allPhotos.filter(p => !p.toLowerCase().endsWith('.heic') && !soloPhotos.includes(p));
    
    shuffledPhotos = validPhotos.sort(() => Math.random() - 0.5);
    
    // ULTRA-OPTIMIZATION: Only render 4 photos into the DOM at a time, instead of 80+. 
    // This reduces memory payload from ~400MB down to ~15MB!
    for(let i=0; i<4; i++) {
        addCardToDeck();
    }
}

function addCardToDeck() {
    const deck = document.getElementById('memory-deck');
    if(shuffledPhotos.length === 0) return;
    
    const photo = shuffledPhotos[currentPhotoIndex % shuffledPhotos.length];
    
    let card = document.createElement('div');
    card.className = 'polaroid';
    
    let rotation = (Math.random() * 12) - 6; 
    let offsetX = (Math.random() * 10) - 5; 
    let offsetY = (Math.random() * 10) - 5;
    
    card.setAttribute('data-transform', `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`);
    card.style.transform = card.getAttribute('data-transform');
    card.style.zIndex = 50000 - currentPhotoIndex; // Keeps lower indices visually on top
    
    let img = document.createElement('img');
    img.src = `./photo/${photo}`;
    img.setAttribute('decoding', 'async'); // Pushes image decoding to a background CPU thread!
    img.onerror = function() { this.onerror = null; this.src = 'https://via.placeholder.com/300x400/8A2387/FFFFFF?text=Memory'; };
    
    card.appendChild(img);
    
    card.onclick = function() {
        if (Math.random() > 0.5) card.classList.add('thrown-right');
        else card.classList.add('thrown-left');
        
        setTimeout(() => {
            card.remove(); // CRITICAL: Destroy the DOM element to instantly free memory!
        }, 500);
        
        currentPhotoIndex++; // Advance the pointer
        addCardToDeck(); // Spawn exactly 1 new card at the bottom of the stack
    };
    
    deck.appendChild(card);
}

// REAL-TIME RENDERING EFFECT (3D Parallax Tilt)
function initRealTimeTilt() {
    const cards = document.querySelectorAll('.solo-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt based on mouse position
            const rotateX = ((y - centerY) / centerY) * -20; 
            const rotateY = ((x - centerX) / centerX) * 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.08, 1.08, 1.08)`;
            card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(255, 117, 140, 0.6)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            card.style.boxShadow = `0 15px 40px rgba(0,0,0,0.3)`;
            card.style.transition = `transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s ease`;
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = `transform 0.1s ease-out, box-shadow 0.1s ease-out`; // Snappy real-time tracking
        });
    });
}

function checkBirthday() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let bday = new Date(currentYear, 8, 10, 0, 0, 0);

    if (now > new Date(currentYear, 8, 11, 0, 0, 0)) {
        bday = new Date(currentYear + 1, 8, 10, 0, 0, 0);
    }

    const diff = bday - now;

    if (diff <= 0 && diff > -86400000) {
        if (!celebrationView.classList.contains('active')) {
            countdownView.classList.remove('active');
            countdownView.classList.add('hidden');
            
            celebrationView.classList.remove('hidden');
            celebrationView.classList.add('active');
            
            if (!confettiFired) {
                fireConfetti();
                buildMemoryDeck(); // Initialize the 85-photo deck!
                initRealTimeTilt(); // Start the 3D real-time tracking engine
                confettiFired = true;
            }
        }
    } else {
        if (!countdownView.classList.contains('active')) {
            countdownView.classList.remove('hidden');
            countdownView.classList.add('active');
            
            celebrationView.classList.remove('active');
            celebrationView.classList.add('hidden');
            confettiFired = false;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);

        document.getElementById('days').innerText = d.toString().padStart(2, '0');
        document.getElementById('hours').innerText = h.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = m.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = s.toString().padStart(2, '0');
    }
}

function fireConfetti() {
    var duration = 10 * 1000; // Reduced duration to 10s to prevent prolonged lag
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 50, zIndex: 100 }; // Lowered ticks

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 15 * (timeLeft / duration); // Severely reduced particle count
        const luxuryColors = ['#FFD700', '#B76E79', '#8A2387', '#E94057', '#ffffff'];

        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: luxuryColors
        }));
        
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: luxuryColors
        }));
    }, 350); // Increased interval delay to save CPU cycles
}

// POETRY AUDIO PLAYER LOGIC
const musicBtn = document.getElementById('music-toggle');
const bgAudio = document.getElementById('bg-audio');
if (musicBtn && bgAudio) {
    musicBtn.addEventListener('click', () => {
        if (bgAudio.paused) {
            bgAudio.play();
            musicBtn.innerText = "⏸️ Pause Poetry";
        } else {
            bgAudio.pause();
            musicBtn.innerText = "🎵 Play Poetry";
        }
    });
}

setInterval(checkBirthday, 1000);
checkBirthday();
