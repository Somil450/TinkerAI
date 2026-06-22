import { auth } from '../auth.js';

export function renderWelcomePage(container) {
  container.innerHTML = `
    <div class="welcome-container" id="welcome-screen">
      <!-- Animated particle grid -->
      <canvas id="welcome-canvas" class="welcome-canvas"></canvas>

      <!-- Glowing orbs -->
      <div class="orb orb-purple"></div>
      <div class="orb orb-cyan"></div>
      <div class="orb orb-pink"></div>

      <!-- Main card with 3D tilt -->
      <div class="welcome-card-wrapper" id="welcome-card-wrapper">
        <div class="welcome-card" id="welcome-card">
          <!-- Logo area -->
          <div class="wc-logo-wrap">
            <div class="wc-logo-glow"></div>
            <div class="wc-logo-icon">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 8h16l4 8H4z" stroke="url(#lg1)" fill="url(#lg1a)"/>
                <path d="M44 40H28l-4-8h20z" stroke="url(#lg2)" fill="url(#lg2a)"/>
                <path d="M4 40h16" stroke="#7c4dff"/>
                <path d="M28 8h16" stroke="#00e5ff"/>
                <circle cx="24" cy="24" r="6" stroke="url(#lg3)" fill="none"/>
                <circle cx="24" cy="24" r="2" fill="#fff"/>
                <defs>
                  <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#7c4dff"/><stop offset="1" stop-color="#00e5ff"/></linearGradient>
                  <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#f50057"/><stop offset="1" stop-color="#7c4dff"/></linearGradient>
                  <linearGradient id="lg3" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#00e5ff"/><stop offset="1" stop-color="#7c4dff"/></linearGradient>
                  <linearGradient id="lg1a" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#7c4dff" stop-opacity="0.2"/><stop offset="1" stop-color="#00e5ff" stop-opacity="0.2"/></linearGradient>
                  <linearGradient id="lg2a" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#f50057" stop-opacity="0.2"/><stop offset="1" stop-color="#7c4dff" stop-opacity="0.2"/></linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <h1 class="wc-title glitch" data-text="TinkerAI">Tinker<span class="wc-title-ai">AI</span></h1>
          <p class="wc-desc" id="wc-desc-text">Design. Simulate. Create. The AI-powered circuit simulator.</p>

          <!-- Auth View Container -->
          <div class="auth-view-container" id="auth-view-container">
            <!-- Login View -->
            <div class="auth-view active" id="view-login">
              <form id="login-form" class="auth-form">
                <div class="input-group">
                  <input type="email" id="login-email" required placeholder=" " autocomplete="email">
                  <label for="login-email">Email Address</label>
                  <div class="input-glow"></div>
                </div>
                <div class="input-group">
                  <input type="password" id="login-password" required placeholder=" " autocomplete="current-password">
                  <label for="login-password">Password</label>
                  <div class="input-glow"></div>
                </div>
                <button type="submit" class="auth-submit-btn" id="login-submit-btn">
                  <span class="btn-text">Sign In</span>
                  <span class="btn-loader hidden"></span>
                </button>
              </form>
              <div class="auth-divider"><span>OR</span></div>
              <button id="google-login-btn" class="google-btn" aria-label="Sign in with Google">
                <svg class="google-btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span class="google-btn-text">Continue with Google</span>
              </button>
              <p class="auth-switch-text">New to TinkerAI? <button type="button" class="text-btn" id="go-to-register">Create an account</button></p>
            </div>

            <!-- Register View -->
            <div class="auth-view" id="view-register">
              <form id="register-form" class="auth-form">
                <div class="input-group">
                  <input type="email" id="register-email" required placeholder=" " autocomplete="email">
                  <label for="register-email">Email Address</label>
                  <div class="input-glow"></div>
                </div>
                <div class="input-group">
                  <input type="password" id="register-password" required placeholder=" " autocomplete="new-password">
                  <label for="register-password">Password</label>
                  <div class="input-glow"></div>
                </div>
                <div class="input-group">
                  <input type="password" id="register-password-confirm" required placeholder=" " autocomplete="new-password">
                  <label for="register-password-confirm">Confirm Password</label>
                  <div class="input-glow"></div>
                </div>
                <button type="submit" class="auth-submit-btn" id="register-submit-btn">
                  <span class="btn-text">Create Account</span>
                  <span class="btn-loader hidden"></span>
                </button>
              </form>
              <div class="auth-divider"><span>OR</span></div>
              <button id="google-register-btn" class="google-btn" aria-label="Sign in with Google">
                <svg class="google-btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span class="google-btn-text">Sign up with Google</span>
              </button>
              <p class="auth-switch-text">Already have an account? <button type="button" class="text-btn" id="go-to-login">Sign in</button></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom floating circuit elements -->
      <div class="floating-chip fc-1">IC</div>
      <div class="floating-chip fc-2">Ω</div>
      <div class="floating-chip fc-3">∿</div>
      <div class="floating-chip fc-4">⊕</div>
    </div>
  `;

  // --- Crazy Canvas Swarm Background ---
  const canvas = document.getElementById('welcome-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, dots = [], animFrame;
  let mouse = { x: null, y: null };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initDots() {
    dots = [];
    const count = Math.floor((W * H) / 10000); // More dense for swarming
    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * W,
        y: Math.random() * H,
        baseX: Math.random() * W,
        baseY: Math.random() * H,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  function drawConnections() {
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.2 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateDots() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    dots.forEach(d => {
      // Swarm effect towards mouse
      if (mouse.x != null) {
        let dx = mouse.x - d.x;
        let dy = mouse.y - d.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 300) {
          d.vx += (dx / dist) * 0.05;
          d.vy += (dy / dist) * 0.05;
        }
      }
      
      // Friction and bounds
      d.vx *= 0.98;
      d.vy *= 0.98;
      d.x += d.vx;
      d.y += d.vy;
      
      // Pull back to base if wandering too far
      let bdx = d.baseX - d.x;
      let bdy = d.baseY - d.y;
      d.vx += bdx * 0.0005;
      d.vy += bdy * 0.0005;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 160, 255, ${d.opacity})`;
      ctx.fill();
    });
    animFrame = requestAnimationFrame(animateDots);
  }

  resize();
  initDots();
  animateDots();
  window.addEventListener('resize', () => { resize(); initDots(); });

  // --- 3D Card Tilt Effect ---
  const cardWrapper = document.getElementById('welcome-card-wrapper');
  const card = document.getElementById('welcome-card');
  
  cardWrapper.addEventListener('mousemove', (e) => {
    const rect = cardWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  cardWrapper.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });

  // --- UI View Switching ---
  const viewLogin = document.getElementById('view-login');
  const viewRegister = document.getElementById('view-register');
  const descText = document.getElementById('wc-desc-text');

  document.getElementById('go-to-register').addEventListener('click', () => {
    viewLogin.classList.remove('active');
    viewRegister.classList.add('active');
    descText.textContent = "Create an account to save your brilliant circuits.";
    card.style.animation = "none";
    card.offsetHeight; // trigger reflow
    card.style.animation = "glitchBounce 0.4s ease";
  });

  document.getElementById('go-to-login').addEventListener('click', () => {
    viewRegister.classList.remove('active');
    viewLogin.classList.add('active');
    descText.textContent = "Design. Simulate. Create. The AI-powered circuit simulator.";
    card.style.animation = "none";
    card.offsetHeight;
    card.style.animation = "glitchBounce 0.4s ease";
  });

  // --- Auth Handlers ---
  const handleAuthAction = async (btn, actionPromise) => {
    if (btn.disabled) return;
    const btnText = btn.querySelector('.btn-text, .google-btn-text');
    const btnLoader = btn.querySelector('.btn-loader');
    const originalText = btnText.textContent;
    
    btn.disabled = true;
    btn.classList.add('loading');
    if(btnLoader) btnLoader.classList.remove('hidden');
    btnText.textContent = 'Processing...';

    try {
      await actionPromise();
      btnText.textContent = '✓ Success!';
      btn.classList.add('success');
    } catch (err) {
      console.error('Auth Error:', err);
      btn.disabled = false;
      btn.classList.remove('loading');
      btnText.textContent = originalText;
      if(btnLoader) btnLoader.classList.add('hidden');

      const msg = mapAuthError(err.code);
      showAuthError(msg);
    }
  };

  const mapAuthError = (code) => {
    switch(code) {
      case 'auth/email-already-in-use': return "This email is already registered.";
      case 'auth/invalid-email': return "Invalid email address format.";
      case 'auth/weak-password': return "Password must be at least 6 characters.";
      case 'auth/invalid-credential': return "Invalid email or password.";
      case 'auth/popup-closed-by-user': return "Sign-in cancelled.";
      default: return "Authentication failed. Please try again.";
    }
  };

  function showAuthError(msg) {
    let existing = document.getElementById('auth-error-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'auth-error-toast';
    toast.className = 'auth-error-toast';
    toast.textContent = msg;
    card.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // Bind Email/Password Login
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    handleAuthAction(document.getElementById('login-submit-btn'), () => auth.signInWithEmail(email, pass));
  });

  // Bind Email/Password Register
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const pass = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-password-confirm').value;
    
    if (pass !== confirm) {
      showAuthError("Passwords do not match.");
      return;
    }

    const btn = document.getElementById('register-submit-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');
    const originalText = btnText.textContent;
    
    btn.disabled = true;
    btn.classList.add('loading');
    if(btnLoader) btnLoader.classList.remove('hidden');
    btnText.textContent = 'Processing...';

    try {
      await auth.registerWithEmail(email, pass);
      btnText.textContent = '✓ Account Created!';
      btn.classList.add('success');
      
      // Delay briefly so they see success, then flip to Login view
      setTimeout(() => {
         // Reset button
         btn.disabled = false;
         btn.classList.remove('loading', 'success');
         btnText.textContent = originalText;
         if(btnLoader) btnLoader.classList.add('hidden');
         
         // Clear form and flip to login
         document.getElementById('register-form').reset();
         document.getElementById('go-to-login').click();
         
         // Pre-fill the email on the login form for convenience
         document.getElementById('login-email').value = email;
      }, 1200);

    } catch (err) {
      console.error('Auth Error:', err);
      btn.disabled = false;
      btn.classList.remove('loading');
      btnText.textContent = originalText;
      if(btnLoader) btnLoader.classList.add('hidden');
      const msg = mapAuthError(err.code);
      showAuthError(msg);
    }
  });

  // Bind Google Auth
  document.getElementById('google-login-btn').addEventListener('click', () => {
    handleAuthAction(document.getElementById('google-login-btn'), () => auth.signInWithGoogle());
  });
  
  document.getElementById('google-register-btn').addEventListener('click', async () => {
    const btn = document.getElementById('google-register-btn');
    const btnText = btn.querySelector('.google-btn-text');
    const btnLoader = btn.querySelector('.google-btn-loader');
    const originalText = btnText.textContent;
    
    btn.disabled = true;
    btn.classList.add('loading');
    if(btnLoader) btnLoader.classList.remove('hidden');
    btnText.textContent = 'Processing...';

    try {
      await auth.signInWithGoogle();
      // Immediately sign out to prevent auto-login
      await auth.signOut();
      
      btnText.textContent = '✓ Success!';
      btn.classList.add('success');
      
      setTimeout(() => {
         btn.disabled = false;
         btn.classList.remove('loading', 'success');
         btnText.textContent = originalText;
         if(btnLoader) btnLoader.classList.add('hidden');
         
         // Flip to login
         document.getElementById('go-to-login').click();
      }, 1200);

    } catch (err) {
      console.error('Auth Error:', err);
      btn.disabled = false;
      btn.classList.remove('loading');
      btnText.textContent = originalText;
      if(btnLoader) btnLoader.classList.add('hidden');
      const msg = mapAuthError(err.code);
      showAuthError(msg);
    }
  });

  // Cleanup on unmount
  container._cleanup = () => {
    cancelAnimationFrame(animFrame);
  };
}
