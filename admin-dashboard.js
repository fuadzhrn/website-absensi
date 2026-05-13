/* admin-dashboard.js
   Handle interactions on admin dashboard page:
   - Simple login check (localStorage)
   - Logout
   - Sidebar active state
   - User dropdown
   - Buttons that show alerts
*/
document.addEventListener('DOMContentLoaded', function () {
  // Redirect to login if not logged-in (simple dummy check)
  if (localStorage.getItem('isLogin') !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  // Elements
  const logoutBtn = document.getElementById('logoutBtn');
  const profileBtn = document.getElementById('profileBtn');
  const userArea = document.getElementById('userArea');
  const userMenu = document.getElementById('userMenu');
  const lihatSemua = document.getElementById('lihatSemua');
  const lihatAktivitas = document.getElementById('lihatAktivitas');
  const navItems = document.querySelectorAll('.nav-item');

  // Logout action: remove dummy login and redirect to login page
  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('isLogin');
    window.location.href = 'index.html';
  });

  // Profile button — placeholder
  profileBtn.addEventListener('click', function () {
    alert('Menu Profil (placeholder)');
  });

  // User dropdown toggle
  userArea.addEventListener('click', function (e) {
    e.stopPropagation();
    const shown = userMenu.style.display === 'flex';
    userMenu.style.display = shown ? 'none' : 'flex';
  });
  // Close dropdown when clicking outside
  document.addEventListener('click', function () { userMenu.style.display = 'none'; });

  // Sidebar menu: set active on click
  navItems.forEach(item => {
    item.addEventListener('click', function () {
      const key = this.dataset.key;
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      // Navigation behavior for sidebar items
      if (key === 'logout') {
        localStorage.removeItem('isLogin');
        window.location.href = 'index.html';
        return;
      }
      if (key === 'mahasiswa') {
        // go to Data Mahasiswa page
        window.location.href = 'data-mahasiswa.html';
        return;
      }
      if (key === 'dashboard') {
        // already on dashboard, but ensure correct page
        window.location.href = 'admin-dashboard.html';
        return;
      }
      // Placeholder for other pages
      alert('Navigasi: ' + key + ' (placeholder)');
    });
  });

  // Buttons show alerts (placeholder)
  if (lihatSemua) lihatSemua.addEventListener('click', () => alert('Tampilkan seluruh data (placeholder)'));
  if (lihatAktivitas) lihatAktivitas.addEventListener('click', () => alert('Tampilkan semua aktivitas (placeholder)'));
});
