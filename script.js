/*
  script.js
  Frontend behavior for the login page:
  - Simple client-side validation
  - Password show/hide toggle
  - Hamburger visual toggle (no navigation)
*/

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  const userInput = document.getElementById('userInput');
  const passwordInput = document.getElementById('passwordInput');
  const roleSelect = document.getElementById('roleSelect');
  const roleError = document.getElementById('roleError');
  const userError = document.getElementById('userError');
  const passError = document.getElementById('passError');
  const togglePassword = document.getElementById('togglePassword');
  const hamburger = document.getElementById('hamburger');

  // Toggle password visibility
  togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    // Update aria-label
    this.setAttribute('aria-label', type === 'password' ? 'Tampilkan password' : 'Sembunyikan password');
  });

  // Simple hamburger visual toggle (for mobile UX polish)
  hamburger.addEventListener('click', function () {
    this.classList.toggle('open');
  });

  // Form validation
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;
    userError.textContent = '';
    passError.textContent = '';

    if (!userInput.value.trim()) {
      userError.textContent = 'Email atau username wajib diisi';
      valid = false;
    }
    if (!passwordInput.value.trim()) {
      passError.textContent = 'Password wajib diisi';
      valid = false;
    }

    if (valid) {
      // Dummy login with role support: save role and redirect accordingly
      const role = roleSelect ? roleSelect.value : '';
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('role', role);
      if (role === 'Admin') {
        alert('Login berhasil sebagai Admin');
        window.location.href = 'admin-dashboard.html';
      } else if (role === 'Dosen') {
        alert('Login berhasil sebagai Dosen');
        window.location.href = 'dosen-dashboard.html';
      } else if (role === 'Mahasiswa') {
        alert('Login berhasil sebagai Mahasiswa');
        window.location.href = 'scan-qrcode.html';
      } else {
        // fallback
        alert('Login berhasil');
        window.location.href = 'admin-dashboard.html';
      }
    }
  });
});
