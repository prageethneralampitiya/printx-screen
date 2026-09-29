// ==========================================================================
// PRINT X — INTERACTIVE JAVASCRIPT
// Particle Canvas, Dynamic WhatsApp Link, Micro-Interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Interactive Service Selection & Dynamic WhatsApp Message
  const serviceChips = document.querySelectorAll('.service-chip');
  const whatsappBtn = document.getElementById('whatsappBtn');
  const serviceHint = document.getElementById('serviceHint');
  const defaultPhone = '94701434949';

  function updateWhatsAppLink(serviceName) {
    const encodedMessage = encodeURIComponent(
      `Hello PRINT X, I would like to inquire about ${serviceName}. Please share details, pricing and turnaround time.`
    );
    const newHref = `https://wa.me/${defaultPhone}?text=${encodedMessage}`;
    if (whatsappBtn) {
      whatsappBtn.setAttribute('href', newHref);
    }
    if (serviceHint) {
      serviceHint.innerHTML = `Inquiring for: <strong style="color:#fff;">${serviceName}</strong> (Click button to send)`;
    }
  }

  serviceChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      serviceChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const serviceName = chip.getAttribute('data-service') || chip.innerText.trim();
      updateWhatsAppLink(serviceName);

      // Micro-bounce visual
      chip.style.transform = 'scale(0.95)';
      setTimeout(() => {
        chip.style.transform = '';
      }, 150);
    });
  });

  // 3. Quick Copy Phone & Toast Notification
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', async () => {
      const phoneNumber = '070 143 4949';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(phoneNumber);
          showToast(`Copied ${phoneNumber} to clipboard!`);
        } else {
          // Fallback
          window.location.href = `tel:${phoneNumber.replace(/\s+/g, '')}`;
        }
      } catch (err) {
        window.location.href = `tel:${phoneNumber.replace(/\s+/g, '')}`;
      }
    });
  }

  // 4. Subtle Interactive Particle Background
  initParticleCanvas();
});

function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor(width / 32), 45);
  const particles = [];

  // Particle color palette: subtle rubies, warm embers, and faint whites
  const colors = [
    'rgba(255, 45, 85, 0.4)',
    'rgba(255, 99, 72, 0.3)',
    'rgba(240, 240, 255, 0.25)',
    'rgba(180, 190, 210, 0.2)'
  ];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      alpha: Math.random() * 0.6 + 0.2
    });
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 45, 85, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}
