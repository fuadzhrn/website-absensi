/* dosen-dashboard.js
   - Check localStorage for login and role
   - Handle sidebar navigation, user dropdown, logout
   - Button interactions (buat QR, rekap, lihat detail)
*/
document.addEventListener('DOMContentLoaded', function () {
  // Auth check: must be logged and role Dosen
  if (localStorage.getItem('isLogin') !== 'true' || localStorage.getItem('role') !== 'Dosen') {
    alert('Akses hanya untuk Dosen');
    window.location.href = 'index.html';
    return;
  }

  const navItems = document.querySelectorAll('.nav-item');
  const logoutItem = document.querySelector('.nav-item[data-key="logout"]');
  const buatQrTop = document.getElementById('buatQrTop');
  const quickBuat = document.getElementById('quickBuatQr');
  const quickRekap = document.getElementById('quickRekap');
  const detailBtns = document.querySelectorAll('.detail');
  const userArea = document.getElementById('userArea');
  const userMenu = document.getElementById('userMenu');
  const profileBtn = document.getElementById('profileBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // Sidebar click handling
  navItems.forEach(item => {
    item.addEventListener('click', function () {
      const key = this.dataset.key;
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      if (key === 'logout') {
        localStorage.removeItem('isLogin');
        localStorage.removeItem('role');
        window.location.href = 'index.html';
        return;
      }
      if (key === 'buat-qrcode') {
        window.location.href = 'buat-qrcode.html';
        return;
      }
      if (key === 'rekap') {
        window.location.href = 'rekap-absensi-dosen.html';
        return;
      }
      // other items keep within page
    });
  });

  // Top create QR button
  if (buatQrTop) buatQrTop.addEventListener('click', () => { window.location.href = 'buat-qrcode.html'; });
  if (quickBuat) quickBuat.addEventListener('click', () => { window.location.href = 'buat-qrcode.html'; });
  if (quickRekap) quickRekap.addEventListener('click', () => { window.location.href = 'rekap-absensi-dosen.html'; });

  // Detail buttons
  detailBtns.forEach(b => b.addEventListener('click', () => alert('Detail rekap absensi ditampilkan')));

  // User dropdown
  userArea.addEventListener('click', function (e) {
    e.stopPropagation();
    userMenu.style.display = userMenu.style.display === 'flex' ? 'none' : 'flex';
  });
  document.addEventListener('click', () => userMenu.style.display = 'none');
  profileBtn.addEventListener('click', () => alert('Profil (placeholder)'));
  logoutBtn.addEventListener('click', () => { localStorage.removeItem('isLogin'); localStorage.removeItem('role'); window.location.href = 'index.html'; });
});
