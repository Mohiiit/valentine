/* ============================================
   VALENTINE PARALLAX — Interactive Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ========== CUSTOM CURSOR ==========
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursorGlow.style.left = cursorX + 'px';
    cursorGlow.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect for interactive elements
  document.querySelectorAll('button, a, .reason-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorGlow.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hovering'));
  });

  // ========== FLOATING HEARTS ==========
  const heartsContainer = document.getElementById('floatingHearts');
  const heartSymbols = ['♥', '♡', '❤', '❥', '❦'];

  function spawnFloatingHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (10 + Math.random() * 16) + 'px';
    heart.style.animationDuration = (8 + Math.random() * 12) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heart.style.color = `hsl(${345 + Math.random() * 20}, ${60 + Math.random() * 30}%, ${65 + Math.random() * 20}%)`;
    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 22000);
  }

  // Spawn hearts periodically
  setInterval(spawnFloatingHeart, 800);
  // Spawn a batch initially
  for (let i = 0; i < 8; i++) {
    setTimeout(spawnFloatingHeart, i * 300);
  }

  // ========== PARALLAX SCROLLING ==========
  const parallaxBgs = document.querySelectorAll('.parallax-bg');
  const parallaxMids = document.querySelectorAll('.parallax-mid');

  function handleParallax() {
    const scrollY = window.scrollY;

    parallaxBgs.forEach(bg => {
      const section = bg.closest('.section');
      const sectionTop = section.offsetTop;
      const offset = (scrollY - sectionTop) * 0.15;
      bg.style.transform = `translateY(${offset}px)`;
    });

    parallaxMids.forEach(mid => {
      const section = mid.closest('.section');
      const sectionTop = section.offsetTop;
      const offset = (scrollY - sectionTop) * 0.08;
      mid.style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // ========== SCROLL-TRIGGERED ANIMATIONS ==========
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe reasons heading
  const reasonsHeading = document.querySelector('.reasons-heading');
  if (reasonsHeading) observer.observe(reasonsHeading);

  // Observe reason cards with staggered delay
  document.querySelectorAll('.reason-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
    observer.observe(card);
  });

  // ========== THE MISCHIEVOUS NO BUTTON ==========
  const btnNo = document.getElementById('btnNo');
  const btnYes = document.getElementById('btnYes');
  const noText = document.getElementById('noText');
  const noMessage = document.getElementById('noMessage');
  const buttonsArea = document.getElementById('buttonsArea');

  const funnyMessages = [
    "Are you sure? 🤔",
    "Think again! 💭",
    "Wrong button! ➡️",
    "Oops, try the other one!",
    "Nuh-uh! 😏",
    "That button's broken!",
    "Almost... but no! 💃",
    "Nice try! 😘",
    "You can't catch me!",
    "Hehe, nope! 🙈"
  ];

  let noAttempts = 0;
  let noScale = 1;
  let isNoGone = false;

  function getQuestionSection() {
    return document.getElementById('question');
  }

  function moveNoButton() {
    if (isNoGone) return;

    noAttempts++;
    btnNo.classList.add('fleeing');

    // Show funny message
    const msg = funnyMessages[Math.min(noAttempts - 1, funnyMessages.length - 1)];
    noMessage.textContent = msg;
    noMessage.classList.add('visible');
    setTimeout(() => noMessage.classList.remove('visible'), 2000);

    // Shrink the No button
    noScale = Math.max(0.4, 1 - noAttempts * 0.08);
    btnNo.style.transform = `scale(${noScale})`;

    // Grow the Yes button
    const yesGrow = 1 + noAttempts * 0.06;
    btnYes.style.transform = `scale(${Math.min(yesGrow, 1.4)})`;

    // Move to random position within the question section
    const section = getQuestionSection();
    const sectionRect = section.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const padding = 20;
    const maxX = sectionRect.width - btnRect.width - padding * 2;
    const maxY = sectionRect.height - btnRect.height - padding * 2;

    const newX = padding + Math.random() * maxX;
    const newY = padding + Math.random() * maxY;

    // Position relative to the buttons area
    const areaRect = buttonsArea.getBoundingClientRect();
    const relX = newX - (areaRect.left - sectionRect.left);
    const relY = newY - (areaRect.top - sectionRect.top);

    btnNo.style.left = relX + 'px';
    btnNo.style.top = relY + 'px';

    // After many attempts, fade away
    if (noAttempts >= 7) {
      isNoGone = true;
      noMessage.textContent = "Fine, the No button has left the chat! 👋";
      noMessage.classList.add('visible');
      btnNo.classList.add('fading');
      setTimeout(() => {
        btnNo.style.display = 'none';
      }, 800);
    }
  }

  // Desktop: mouseover
  btnNo.addEventListener('mouseenter', (e) => {
    e.preventDefault();
    moveNoButton();
  });

  // Mobile: touchstart
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
  });

  // Also prevent click
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
  });

  // ========== YES BUTTON — CELEBRATION ==========
  const celebration = document.getElementById('celebration');
  const celebrationContent = document.getElementById('celebrationContent');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const heartBurst = document.getElementById('heartBurst');

  btnYes.addEventListener('click', () => {
    // Show celebration section
    celebration.classList.add('active');

    // Smooth scroll to celebration
    setTimeout(() => {
      celebration.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Trigger heart burst
    setTimeout(() => {
      createHeartBurst();
      celebrationContent.classList.add('visible');
    }, 600);

    // Start confetti
    setTimeout(startConfetti, 800);
  });

  // ========== HEART BURST ANIMATION ==========
  function createHeartBurst() {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'burst-heart';
      heart.textContent = '♥';
      const angle = (i / count) * Math.PI * 2;
      const distance = 80 + Math.random() * 120;
      heart.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
      heart.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
      heart.style.setProperty('--rot', (Math.random() * 360) + 'deg');
      heart.style.animationDelay = Math.random() * 0.3 + 's';
      heart.style.fontSize = (16 + Math.random() * 20) + 'px';
      heartBurst.appendChild(heart);
    }
  }

  // ========== CONFETTI CANVAS ==========
  function startConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const confetti = [];
    const colors = [
      '#c9485b', '#e8788a', '#c9a84c', '#e4cc7a',
      '#f2d1d1', '#b76e79', '#ff6b8a', '#ff9eb5',
      '#ffd1dc', '#fff0f3', '#d4a0a0'
    ];

    class ConfettiPiece {
      constructor() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = -20 - Math.random() * confettiCanvas.height;
        this.w = 6 + Math.random() * 8;
        this.h = 4 + Math.random() * 6;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = 1 + Math.random() * 3;
        this.angle = Math.random() * Math.PI * 2;
        this.va = (Math.random() - 0.5) * 0.15;
        this.opacity = 0.8 + Math.random() * 0.2;
        this.shape = Math.random() > 0.5 ? 'rect' : 'heart';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.va;
        this.vx += (Math.random() - 0.5) * 0.1;
        this.vy += 0.02;
        this.opacity -= 0.001;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;

        if (this.shape === 'heart') {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          const s = this.w / 10;
          ctx.moveTo(0, s * 3);
          ctx.bezierCurveTo(0, 0, -s * 5, 0, -s * 5, s * 3);
          ctx.bezierCurveTo(-s * 5, s * 6, 0, s * 8, 0, s * 10);
          ctx.bezierCurveTo(0, s * 8, s * 5, s * 6, s * 5, s * 3);
          ctx.bezierCurveTo(s * 5, 0, 0, 0, 0, s * 3);
          ctx.fill();
        } else {
          ctx.fillStyle = this.color;
          ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
        }

        ctx.restore();
      }
    }

    // Spawn confetti in bursts
    let spawnCount = 0;
    const maxSpawn = 200;

    function spawnBurst() {
      if (spawnCount < maxSpawn) {
        for (let i = 0; i < 8; i++) {
          confetti.push(new ConfettiPiece());
          spawnCount++;
        }
        setTimeout(spawnBurst, 100);
      }
    }
    spawnBurst();

    function animateConfetti() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      for (let i = confetti.length - 1; i >= 0; i--) {
        confetti[i].update();
        confetti[i].draw();

        if (confetti[i].y > confettiCanvas.height + 20 || confetti[i].opacity <= 0) {
          confetti.splice(i, 1);
        }
      }

      if (confetti.length > 0 || spawnCount < maxSpawn) {
        requestAnimationFrame(animateConfetti);
      }
    }
    animateConfetti();

    // Handle resize
    window.addEventListener('resize', () => {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    });
  }

  // ========== INITIAL SETUP ==========
  // Position the No button initially
  btnNo.style.position = 'relative';
  btnNo.style.left = 'auto';
  btnNo.style.top = 'auto';
});
