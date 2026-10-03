/**
 * ITZFIZZ — Scroll-Driven Supercar Hero Section Animation
 * Built with GSAP, ScrollTrigger, Lenis Smooth Scroll & Web Audio API
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // =========================================================================
  // 1. LENIS SMOOTH SCROLL INITIALIZATION
  // =========================================================================
  let lenis = null;
  try {
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothTouch: false,
        wheelMultiplier: 1.0,
      });

      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }
  } catch (err) {
    console.warn('Lenis smooth scroll failed to initialize, defaulting to native scroll:', err);
  }

  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  // =========================================================================
  // 2. DOM ELEMENTS & CACHED SELECTORS
  // =========================================================================
  const heroSection = document.getElementById('heroPinSection');
  const heroViewport = document.getElementById('heroViewport');
  const road = document.getElementById('road');
  const carWrapper = document.getElementById('carWrapper');
  const car = document.getElementById('car');
  const trail = document.getElementById('trail');
  const letters = gsap.utils.toArray('.value-letter:not(.spacer)');
  const allLetters = gsap.utils.toArray('.value-letter');
  const scrollHint = document.getElementById('scrollHint');
  const speedNum = document.getElementById('speedNum');
  const navSpeed = document.getElementById('navSpeed');
  const navGear = document.getElementById('navGear');
  const boostBar = document.getElementById('boostBar');
  const scrollProgressVal = document.getElementById('scrollProgressVal');
  const audioToggle = document.getElementById('audioToggle');
  const audioIcon = document.getElementById('audioIcon');

  const metricBoxes = [
    { el: document.getElementById('box1'), target: 58, progress: '58%', triggered: false },
    { el: document.getElementById('box2'), target: 23, progress: '23%', triggered: false },
    { el: document.getElementById('box3'), target: 27, progress: '27%', triggered: false },
    { el: document.getElementById('box4'), target: 40, progress: '40%', triggered: false }
  ];

  // =========================================================================
  // 3. LETTER POSITION CACHE & GEOMETRY
  // =========================================================================
  let letterPositions = [];

  function calculateLetterPositions() {
    letterPositions = letters.map((letter) => {
      const rect = letter.getBoundingClientRect();
      return {
        el: letter,
        centerX: rect.left + rect.width / 2,
        left: rect.left,
        char: letter.getAttribute('data-char') || letter.textContent.trim()
      };
    });
  }

  // Calculate after fonts & layout settle
  calculateLetterPositions();
  window.addEventListener('resize', () => {
    calculateLetterPositions();
    ScrollTrigger.refresh();
  });

  // =========================================================================
  // 4. WEB AUDIO SYNTHESIZER (Luxury Supercar Sound FX)
  // =========================================================================
  let audioCtx = null;
  let isAudioActive = false;
  let engineOsc1 = null;
  let engineOsc2 = null;
  let engineGain = null;
  let engineFilter = null;

  function initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Dual oscillator engine synthesis
      engineOsc1 = audioCtx.createOscillator();
      engineOsc2 = audioCtx.createOscillator();
      engineFilter = audioCtx.createBiquadFilter();
      engineGain = audioCtx.createGain();

      engineOsc1.type = 'sawtooth';
      engineOsc1.frequency.setValueAtTime(45, audioCtx.currentTime); // Low engine idle rumble

      engineOsc2.type = 'triangle';
      engineOsc2.frequency.setValueAtTime(90, audioCtx.currentTime);

      engineFilter.type = 'lowpass';
      engineFilter.frequency.setValueAtTime(250, audioCtx.currentTime);

      engineGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

      engineOsc1.connect(engineFilter);
      engineOsc2.connect(engineFilter);
      engineFilter.connect(engineGain);
      engineGain.connect(audioCtx.destination);

      engineOsc1.start();
      engineOsc2.start();
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  function updateEnginePitch(velocity) {
    if (!audioCtx || !isAudioActive || !engineOsc1) return;
    const baseFreq = 45;
    const maxFreq = 220;
    const normalizedVel = Math.min(Math.abs(velocity) / 30, 1);
    const targetFreq = baseFreq + (maxFreq - baseFreq) * normalizedVel;

    engineOsc1.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.08);
    engineOsc2.frequency.setTargetAtTime(targetFreq * 1.5, audioCtx.currentTime, 0.08);
    engineFilter.frequency.setTargetAtTime(200 + normalizedVel * 1200, audioCtx.currentTime, 0.08);
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (!audioCtx) {
        initAudio();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      isAudioActive = !isAudioActive;
      audioToggle.classList.toggle('active', isAudioActive);

      if (isAudioActive) {
        if (engineGain) engineGain.gain.setTargetAtTime(0.08, audioCtx.currentTime, 0.1);
        audioIcon.setAttribute('data-lucide', 'volume-2');
      } else {
        if (engineGain) engineGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
        audioIcon.setAttribute('data-lucide', 'volume-x');
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // =========================================================================
  // 5. INITIAL LOAD ANIMATION TIMELINE (Smooth Staggered Entrance)
  // =========================================================================
  function runIntroAnimation() {
    const introTl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    // Animate Navbar
    introTl.from('.navbar', {
      y: -50,
      opacity: 0,
      duration: 0.9
    }, 0.1);

    // Animate Hero Tagline and Subtext
    introTl.from('.hero-tagline-wrapper', {
      scale: 0.85,
      opacity: 0,
      duration: 0.7
    }, 0.3);

    introTl.from('.hero-subtext', {
      y: 20,
      opacity: 0,
      duration: 0.8
    }, 0.45);

    // Stagger in the letter headline
    introTl.from(allLetters, {
      y: 40,
      opacity: 0,
      stagger: 0.03,
      duration: 0.8,
      ease: 'back.out(1.2)'
    }, 0.5);

    // Slide car smoothly into road starting position
    introTl.from(carWrapper, {
      x: -250,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      onComplete: () => {
        calculateLetterPositions();
      }
    }, 0.6);

    // Staggered preview pulse for metric cards
    introTl.from('.metric-card', {
      y: 40,
      opacity: 0,
      scale: 0.88,
      stagger: 0.15,
      duration: 0.8,
      ease: 'back.out(1.4)'
    }, 0.8);

    // Scroll Hint bounce
    introTl.from(scrollHint, {
      y: 15,
      opacity: 0,
      duration: 0.6
    }, 1.2);
  }

  // Run intro
  runIntroAnimation();

  // =========================================================================
  // 6. SCROLL-DRIVEN ANIMATION & PHYSICS (GSAP ScrollTrigger)
  // =========================================================================
  let lastCarX = 0;
  let lastTime = performance.now();
  let currentSpeed = 0;

  // Car translation bounds
  const getEndX = () => {
    const roadWidth = window.innerWidth;
    const carWidth = carWrapper ? carWrapper.offsetWidth : 200;
    return roadWidth - carWidth * 0.8;
  };

  // Main Car Travel Tween scrubbed with ScrollTrigger
  const scrollAnim = gsap.to(carWrapper, {
    x: () => getEndX(),
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2, // Smooth interpolation / scrub damping
      pin: heroViewport,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const velocity = self.getVelocity();

        // 1. Calculate dynamic car X position
        const currentCarX = gsap.getProperty(carWrapper, 'x') || 0;
        const carFrontBumper = currentCarX + (carWrapper.offsetWidth * 0.85);

        // 2. Extend the glowing neon energy trail
        if (trail) {
          trail.style.width = `${Math.max(0, currentCarX + 80)}px`;
        }

        // 3. Kinetic Letter Reveal / Illumination
        letters.forEach((letter) => {
          const rect = letter.getBoundingClientRect();
          const letterCenterX = rect.left + (rect.width * 0.5);

          // If car headlights/front reaches or surpasses letter position
          if (carFrontBumper >= letterCenterX - 30) {
            letter.classList.add('illuminated');
          } else {
            letter.classList.remove('illuminated');
          }
        });

        // 4. Update HUD Telemetry (Speed, Gear, Boost, Progress)
        const now = performance.now();
        const dt = (now - lastTime) / 1000;
        lastTime = now;

        // Speed physics calculation (0 to 341 km/h max speed)
        const instantSpeed = Math.min(341, Math.round(Math.abs(velocity) * 0.12 + progress * 240));
        currentSpeed += (instantSpeed - currentSpeed) * 0.2; // Smooth lerp
        const displaySpeed = Math.max(0, Math.round(currentSpeed));

        if (speedNum) speedNum.textContent = String(displaySpeed).padStart(3, '0');
        if (navSpeed) navSpeed.innerHTML = `${displaySpeed} <small>KM/H</small>`;

        // Calculate Automatic Dual-Clutch Gear Shift
        let gear = 'N';
        if (displaySpeed > 0 && displaySpeed < 45) gear = '1ST';
        else if (displaySpeed >= 45 && displaySpeed < 95) gear = '2ND';
        else if (displaySpeed >= 95 && displaySpeed < 155) gear = '3RD';
        else if (displaySpeed >= 155 && displaySpeed < 210) gear = '4TH';
        else if (displaySpeed >= 210 && displaySpeed < 265) gear = '5TH';
        else if (displaySpeed >= 265 && displaySpeed < 310) gear = '6TH';
        else if (displaySpeed >= 310) gear = '7TH';

        if (navGear) navGear.textContent = gear;

        // Boost meter and percentage readout
        if (boostBar) boostBar.style.width = `${Math.min(100, Math.round(progress * 100))}%`;
        if (scrollProgressVal) scrollProgressVal.textContent = `${(progress * 100).toFixed(1)}%`;

        // Update synthesized engine audio frequency
        updateEnginePitch(velocity);

        // Hide scroll hint once user starts scrolling
        if (scrollHint) {
          if (progress > 0.05) {
            scrollHint.style.opacity = '0';
            scrollHint.style.pointerEvents = 'none';
          } else {
            scrollHint.style.opacity = '1';
          }
        }
      }
    }
  });

  // =========================================================================
  // 7. METRIC CARDS SCROLL TRIGGERS & NUMBER COUNTER ANIMATIONS
  // =========================================================================
  function animateCounter(cardData) {
    if (cardData.triggered) return;
    cardData.triggered = true;

    const counterEl = cardData.el.querySelector('.counter');
    if (!counterEl) return;

    const targetVal = cardData.target;
    const obj = { val: 0 };

    gsap.to(obj, {
      val: targetVal,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        counterEl.textContent = Math.round(obj.val);
      }
    });
  }

  // Create individual triggers for the 4 metric cards along scroll track
  const cardTriggers = [
    { id: '#box1', startOffset: 0.15, endOffset: 0.35, cardData: metricBoxes[0] },
    { id: '#box2', startOffset: 0.35, endOffset: 0.55, cardData: metricBoxes[1] },
    { id: '#box3', startOffset: 0.55, endOffset: 0.75, cardData: metricBoxes[2] },
    { id: '#box4', startOffset: 0.75, endOffset: 0.95, cardData: metricBoxes[3] }
  ];

  cardTriggers.forEach((item) => {
    ScrollTrigger.create({
      trigger: heroSection,
      start: () => `top+=${item.startOffset * heroSection.offsetHeight} top`,
      end: () => `top+=${item.endOffset * heroSection.offsetHeight} top`,
      onEnter: () => {
        gsap.to(item.id, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.5)',
          overwrite: 'auto'
        });
        animateCounter(item.cardData);
      },
      onLeaveBack: () => {
        gsap.to(item.id, {
          opacity: 0.15,
          y: 20,
          scale: 0.94,
          duration: 0.4,
          ease: 'power2.in',
          overwrite: 'auto'
        });
      }
    });
  });

  // =========================================================================
  // 8. INTERACTIVE 3D CARD TILT ON MOUSE HOVER
  // =========================================================================
  document.querySelectorAll('.metric-card, .feature-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 12;
      const rotateY = (x / rect.width) * 12;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: 'power1.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });

  // Custom Cursor Glow Follower
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      gsap.to(cursorGlow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.25,
        ease: 'power1.out'
      });
    });
  }
});
