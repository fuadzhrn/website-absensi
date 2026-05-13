/* mahasiswa-dashboard.js
   Frontend logic for Mahasiswa Dashboard page
   - Authentication check
   - Data population
   - Navigation
   - Interactive elements
*/

// Auth guard: check localStorage
document.addEventListener('DOMContentLoaded', function () {
  // Cek login status
  if (localStorage.getItem('isLogin') !== 'true') {
    alert('Silakan login terlebih dahulu');
    window.location.href = 'index.html';
    return;
  }

  // Cek role mahasiswa
  if (localStorage.getItem('role') !== 'Mahasiswa') {
    alert('Akses hanya untuk Mahasiswa');
    window.location.href = 'index.html';
    return;
  }

  // Initialize dashboard
  initializeDashboard();
});

// Dummy schedule data for today
const scheduleData = [
  {
    matkul: 'Pemrograman Dasar',
    jam: '08:00 - 09:40',
    ruangan: 'Lab. Komputer 1',
    dosen: 'Budi Santoso, S.Kom.',
    status: 'Belum Absen'
  },
  {
    matkul: 'Struktur Data',
    jam: '10:00 - 11:40',
    ruangan: 'R. 201',
    dosen: 'Rudi Haryono, M.T.',
    status: 'Sudah Absen'
  },
  {
    matkul: 'Algoritma',
    jam: '13:00 - 14:40',
    ruangan: 'Lab. Komputer 2',
    dosen: 'Budi Santoso, S.Kom.',
    status: 'Belum Absen'
  }
];

// Dummy attendance history data
const historyData = [
  {
    tanggal: '09 Mei 2024',
    matkul: 'Matematika Diskrit',
    jam: '10:00 - 11:40',
    status: 'Hadir'
  },
  {
    tanggal: '07 Mei 2024',
    matkul: 'Struktur Data',
    jam: '13:00 - 14:40',
    status: 'Izin'
  },
  {
    tanggal: '06 Mei 2024',
    matkul: 'Algoritma',
    jam: '08:00 - 09:40',
    status: 'Hadir'
  }
];

function initializeDashboard() {
  // Get DOM elements
  const navItems = document.querySelectorAll('.nav-item');
  const userArea = document.getElementById('userArea');
  const userMenu = document.getElementById('userMenu');
  const profileBtn = document.getElementById('profileBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const scanCard = document.getElementById('scanCard');
  const historyCard = document.getElementById('historyCard');
  const viewAllBtn = document.getElementById('viewAllBtn');

  // Render schedule and history tables
  renderSchedule();
  renderHistory();

  // Sidebar navigation
  navItems.forEach(item => {
    item.addEventListener('click', function () {
      const key = this.dataset.key;
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');

      if (key === 'dashboard') {
        window.location.href = 'mahasiswa-dashboard.html';
      } else if (key === 'scan') {
        window.location.href = 'scan-qrcode.html';
      } else if (key === 'riwayat') {
        window.location.href = 'riwayat-absensi.html';
      } else if (key === 'logout') {
        localStorage.removeItem('isLogin');
        localStorage.removeItem('role');
        window.location.href = 'index.html';
      }
    });
  });

  // User dropdown
  userArea.addEventListener('click', function (e) {
    e.stopPropagation();
    userMenu.style.display = userMenu.style.display === 'flex' ? 'none' : 'flex';
  });

  document.addEventListener('click', function () {
    userMenu.style.display = 'none';
  });

  // Profile button
  profileBtn.addEventListener('click', function () {
    alert('Profil Mahasiswa (Halaman profil belum tersedia)');
  });

  // Logout button
  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('isLogin');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
  });

  // Quick access card - Scan QR Code
  scanCard.addEventListener('click', function () {
    window.location.href = 'scan-qrcode.html';
  });

  // Quick access card - Riwayat Absensi
  historyCard.addEventListener('click', function () {
    window.location.href = 'riwayat-absensi.html';
  });

  // View all button
  viewAllBtn.addEventListener('click', function () {
    window.location.href = 'riwayat-absensi.html';
  });
}

/**
 * Render schedule table
 */
function renderSchedule() {
  const scheduleBody = document.getElementById('scheduleBody');
  scheduleBody.innerHTML = '';

  scheduleData.forEach((item, index) => {
    const row = document.createElement('tr');
    let statusClass = '';
    let statusLabel = item.status;

    if (item.status === 'Belum Absen') {
      statusClass = 'status-belum-absen';
    } else if (item.status === 'Sudah Absen') {
      statusClass = 'status-sudah-absen';
    }

    row.innerHTML = `
      <td>${item.matkul}</td>
      <td>${item.jam}</td>
      <td>${item.ruangan}</td>
      <td>${item.dosen}</td>
      <td>
        <span class="status-badge ${statusClass}" data-index="${index}">
          ${statusLabel}
        </span>
      </td>
    `;

    scheduleBody.appendChild(row);
  });

  // Add event listeners to status badges
  const statusBadges = document.querySelectorAll('.schedule-table .status-badge');
  statusBadges.forEach(badge => {
    badge.addEventListener('click', function (e) {
      e.stopPropagation();
      const index = this.dataset.index;
      const status = scheduleData[index].status;

      if (status === 'Belum Absen') {
        // Redirect to scan page
        window.location.href = 'scan-qrcode.html';
      } else if (status === 'Sudah Absen') {
        // Show alert
        alert('Anda sudah melakukan absensi pada jadwal ini.');
      }
    });
  });
}

/**
 * Render attendance history table
 */
function renderHistory() {
  const historyBody = document.getElementById('historyBody');
  historyBody.innerHTML = '';

  historyData.forEach(item => {
    const row = document.createElement('tr');
    let statusClass = '';

    if (item.status === 'Hadir') {
      statusClass = 'status-hadir';
    } else if (item.status === 'Izin') {
      statusClass = 'status-izin';
    } else if (item.status === 'Alfa') {
      statusClass = 'status-alfa';
    }

    row.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.matkul}</td>
      <td>${item.jam}</td>
      <td><span class="status-badge ${statusClass}">${item.status}</span></td>
    `;

    historyBody.appendChild(row);
  });
}
