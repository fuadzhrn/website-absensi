/* jadwal-mengajar.js
   Frontend logic for Dosen Jadwal Mengajar page
   - Authentication check
   - Schedule table rendering
   - Filter and search functionality
   - Pagination
   - Detail modal
   - Navigation
*/

// Auth guard: check localStorage
document.addEventListener('DOMContentLoaded', function () {
  // Cek login status
  if (localStorage.getItem('isLogin') !== 'true') {
    alert('Silakan login terlebih dahulu');
    window.location.href = 'index.html';
    return;
  }

  // Cek role dosen
  if (localStorage.getItem('role') !== 'Dosen') {
    alert('Akses hanya untuk Dosen');
    window.location.href = 'index.html';
    return;
  }

  // Initialize page
  initializeJadwalMengajar();
});

// Dummy schedule data
const scheduleData = [
  {
    hari: 'Rabu',
    matkul: 'Pemrograman Dasar',
    kelas: 'TI-1A',
    jam: '08:00 - 09:40',
    ruangan: 'Lab. Komputer 1',
    status: 'Aktif'
  },
  {
    hari: 'Rabu',
    matkul: 'Struktur Data',
    kelas: 'TI-2A',
    jam: '10:00 - 11:40',
    ruangan: 'R. 201',
    status: 'Aktif'
  },
  {
    hari: 'Rabu',
    matkul: 'Algoritma',
    kelas: 'SI-1A',
    jam: '13:00 - 14:40',
    ruangan: 'Lab. Komputer 2',
    status: 'Aktif'
  },
  {
    hari: 'Rabu',
    matkul: 'Matematika Diskrit',
    kelas: 'TI-1B',
    jam: '15:00 - 16:40',
    ruangan: 'R. 203',
    status: 'Aktif'
  },
  {
    hari: 'Kamis',
    matkul: 'Basis Data',
    kelas: 'SI-2B',
    jam: '09:00 - 10:40',
    ruangan: 'R. 204',
    status: 'Aktif'
  },
  {
    hari: 'Jumat',
    matkul: 'Pemrograman Web',
    kelas: 'TI-2A',
    jam: '13:30 - 15:10',
    ruangan: 'Lab. Komputer 3',
    status: 'Aktif'
  }
];

// Pagination
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [...scheduleData];

// Get today's day name
function getTodayDayName() {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const today = new Date();
  return days[today.getDay()];
}

function initializeJadwalMengajar() {
  // Get DOM elements
  const searchInput = document.getElementById('searchInput');
  const hariFilter = document.getElementById('hariFilter');
  const kelasFilter = document.getElementById('kelasFilter');
  const filterBtn = document.getElementById('filterBtn');
  const navItems = document.querySelectorAll('.nav-item');
  const userArea = document.getElementById('userArea');
  const userMenu = document.getElementById('userMenu');
  const profileBtn = document.getElementById('profileBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const detailModal = document.getElementById('detailModal');
  const modalClose = document.getElementById('modalClose');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // Render initial data
  renderTable();
  renderPagination();
  renderHariIni();

  // Filter button click
  filterBtn.addEventListener('click', function () {
    applyFilters();
  });

  // Real-time search
  searchInput.addEventListener('input', function () {
    applyFilters();
  });

  // Filter changes
  hariFilter.addEventListener('change', function () {
    applyFilters();
  });

  kelasFilter.addEventListener('change', function () {
    applyFilters();
  });

  // Sidebar navigation
  navItems.forEach(item => {
    item.addEventListener('click', function () {
      const key = this.dataset.key;
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');

      if (key === 'dashboard') {
        window.location.href = 'dosen-dashboard.html';
      } else if (key === 'jadwal') {
        window.location.href = 'jadwal-mengajar.html';
      } else if (key === 'qrcode') {
        window.location.href = 'buat-qrcode.html';
      } else if (key === 'rekap') {
        window.location.href = 'rekap-absensi-dosen.html';
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

  profileBtn.addEventListener('click', function () {
    alert('Profil Dosen (placeholder)');
  });

  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('isLogin');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
  });

  // Modal close
  modalClose.addEventListener('click', function () {
    detailModal.style.display = 'none';
  });

  modalCloseBtn.addEventListener('click', function () {
    detailModal.style.display = 'none';
  });

  detailModal.addEventListener('click', function (e) {
    if (e.target === detailModal) {
      detailModal.style.display = 'none';
    }
  });

  // Pagination buttons
  document.getElementById('prevBtn').addEventListener('click', function () {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
      renderPagination();
    }
  });

  document.getElementById('nextBtn').addEventListener('click', function () {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
      renderPagination();
    }
  });
}

/**
 * Apply all active filters (search, hari, kelas)
 */
function applyFilters() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const hariValue = document.getElementById('hariFilter').value;
  const kelasValue = document.getElementById('kelasFilter').value;

  // Filter data
  filteredData = scheduleData.filter(item => {
    // Search filter
    const searchMatch = !searchValue ||
      item.matkul.toLowerCase().includes(searchValue) ||
      item.kelas.toLowerCase().includes(searchValue) ||
      item.ruangan.toLowerCase().includes(searchValue);

    // Hari filter
    const hariMatch = !hariValue || item.hari === hariValue;

    // Kelas filter
    const kelasMatch = !kelasValue || item.kelas === kelasValue;

    return searchMatch && hariMatch && kelasMatch;
  });

  // Reset to page 1 when filter changes
  currentPage = 1;

  // Render table and pagination
  renderTable();
  renderPagination();
}

/**
 * Render table rows based on current page
 */
function renderTable() {
  const tableBody = document.getElementById('tableBody');
  const emptyState = document.getElementById('emptyState');

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Clear table body
  tableBody.innerHTML = '';

  // Check if data is empty
  if (filteredData.length === 0) {
    emptyState.style.display = 'flex';
    return;
  } else {
    emptyState.style.display = 'none';
  }

  // Render rows
  paginatedData.forEach((item, index) => {
    const row = document.createElement('tr');
    const rowNumber = startIndex + index + 1;

    row.innerHTML = `
      <td>${rowNumber}</td>
      <td>${item.hari}</td>
      <td>${item.matkul}</td>
      <td>${item.kelas}</td>
      <td>${item.jam}</td>
      <td>${item.ruangan}</td>
      <td><span class="status-badge">${item.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-small btn-qr" data-index="${startIndex + index}">
            <i class="fa-solid fa-qrcode"></i> QR
          </button>
          <button class="btn-small btn-detail" data-index="${startIndex + index}">
            <i class="fa-solid fa-info-circle"></i> Detail
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Add event listeners to action buttons
  attachActionListeners();
}

/**
 * Attach event listeners to action buttons
 */
function attachActionListeners() {
  // QR Code buttons
  document.querySelectorAll('.btn-qr').forEach(btn => {
    btn.addEventListener('click', function () {
      const index = parseInt(this.dataset.index);
      const selected = filteredData[index];
      // Save selected schedule to localStorage
      localStorage.setItem('selectedJadwal', JSON.stringify(selected));
      // Navigate to QR code page
      window.location.href = 'buat-qrcode.html';
    });
  });

  // Detail buttons
  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', function () {
      const index = parseInt(this.dataset.index);
      showDetailModal(filteredData[index]);
    });
  });
}

/**
 * Show detail modal
 */
function showDetailModal(jadwal) {
  const modal = document.getElementById('detailModal');
  const modalBody = document.getElementById('modalBody');

  modalBody.innerHTML = `
    <div class="modal-detail-row">
      <span class="modal-detail-label">Mata Kuliah</span>
      <span class="modal-detail-value">${jadwal.matkul}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Kelas</span>
      <span class="modal-detail-value">${jadwal.kelas}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Hari</span>
      <span class="modal-detail-value">${jadwal.hari}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Jam</span>
      <span class="modal-detail-value">${jadwal.jam}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Ruangan</span>
      <span class="modal-detail-value">${jadwal.ruangan}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Status</span>
      <span class="modal-detail-value">${jadwal.status}</span>
    </div>
  `;

  modal.style.display = 'flex';
}

/**
 * Render pagination controls
 */
function renderPagination() {
  const paginationNumbers = document.getElementById('paginationNumbers');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Clear pagination numbers
  paginationNumbers.innerHTML = '';

  // Show max 5 page buttons
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  // Render page numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.classList.add('page-number');
    pageBtn.textContent = i;

    if (i === currentPage) {
      pageBtn.classList.add('active');
    }

    pageBtn.addEventListener('click', function () {
      currentPage = i;
      renderTable();
      renderPagination();
    });

    paginationNumbers.appendChild(pageBtn);
  }

  // Disable prev/next if on first/last page
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

/**
 * Render jadwal hari ini
 */
function renderHariIni() {
  const hariIniList = document.getElementById('hariIniList');
  const todayName = getTodayDayName();

  // Get today's schedule
  const todaySchedule = scheduleData.filter(item => item.hari === todayName);

  hariIniList.innerHTML = '';

  if (todaySchedule.length === 0) {
    hariIniList.innerHTML = '<p style="color: var(--muted); font-size: 13px; margin: 0;">Tidak ada jadwal hari ini</p>';
    return;
  }

  todaySchedule.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('hari-ini-item');
    itemDiv.innerHTML = `
      <div class="hari-ini-matkul">${item.matkul}</div>
      <div class="hari-ini-detail">
        <span><strong>${item.kelas}</strong></span>
        <span>${item.jam}</span>
      </div>
    `;
    hariIniList.appendChild(itemDiv);
  });
}
