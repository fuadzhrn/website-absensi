/* riwayat-absensi.js
   Frontend logic for Mahasiswa Riwayat Absensi page
   - Authentication check
   - Filter and search functionality
   - Pagination
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

  // Cek role mahasiswa
  if (localStorage.getItem('role') !== 'Mahasiswa') {
    alert('Akses hanya untuk Mahasiswa');
    window.location.href = 'index.html';
    return;
  }

  // Initialize page
  initializeRiwayatAbsensi();
});

// Dummy data for attendance history
const attendanceData = [
  {
    no: 1,
    tanggal: '02 Mei 2024',
    matkul: 'Pemrograman Dasar',
    kelas: 'TI-1A',
    jam: '08:00 - 09:40',
    status: 'Hadir',
    keterangan: 'Tepat waktu',
    semester: '1'
  },
  {
    no: 2,
    tanggal: '03 Mei 2024',
    matkul: 'Basis Data',
    kelas: 'TI-1A',
    jam: '10:00 - 11:40',
    status: 'Terlambat',
    keterangan: 'Masuk 10 menit terlambat',
    semester: '1'
  },
  {
    no: 3,
    tanggal: '06 Mei 2024',
    matkul: 'Algoritma',
    kelas: 'TI-1A',
    jam: '08:00 - 09:40',
    status: 'Hadir',
    keterangan: 'Tepat waktu',
    semester: '2'
  },
  {
    no: 4,
    tanggal: '07 Mei 2024',
    matkul: 'Struktur Data',
    kelas: 'SI-1A',
    jam: '13:00 - 14:40',
    status: 'Izin',
    keterangan: 'Izin sakit',
    semester: '2'
  },
  {
    no: 5,
    tanggal: '09 Mei 2024',
    matkul: 'Matematika Diskrit',
    kelas: 'SI-1A',
    jam: '10:00 - 11:40',
    status: 'Hadir',
    keterangan: 'Tepat waktu',
    semester: '3'
  },
  {
    no: 6,
    tanggal: '10 Mei 2024',
    matkul: 'Sistem Operasi',
    kelas: 'TI-1A',
    jam: '14:00 - 15:40',
    status: 'Alfa',
    keterangan: 'Tidak hadir tanpa keterangan',
    semester: '2'
  },
  {
    no: 7,
    tanggal: '11 Mei 2024',
    matkul: 'Jaringan Komputer',
    kelas: 'SI-1A',
    jam: '09:00 - 10:40',
    status: 'Hadir',
    keterangan: 'Tepat waktu',
    semester: '3'
  }
];

// Pagination
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [...attendanceData];

function initializeRiwayatAbsensi() {
  // Get DOM elements
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const semesterFilter = document.getElementById('semesterFilter');
  const filterBtn = document.getElementById('filterBtn');
  const navItems = document.querySelectorAll('.nav-item');
  const userArea = document.getElementById('userArea');
  const userMenu = document.getElementById('userMenu');
  const profileBtn = document.getElementById('profileBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // Render initial data
  renderTable();
  renderPagination();

  // Filter button click
  filterBtn.addEventListener('click', function () {
    applyFilters();
  });

  // Search input enter key
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      applyFilters();
    }
  });

  // Real-time search
  searchInput.addEventListener('input', function () {
    applyFilters();
  });

  // Status filter change
  statusFilter.addEventListener('change', function () {
    applyFilters();
  });

  // Semester filter change
  semesterFilter.addEventListener('change', function () {
    applyFilters();
  });

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
 * Apply all active filters (search, status, semester)
 */
function applyFilters() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const statusValue = document.getElementById('statusFilter').value;
  const semesterValue = document.getElementById('semesterFilter').value;

  // Filter data
  filteredData = attendanceData.filter(item => {
    // Search filter (search in matkul, kelas, status, keterangan)
    const searchMatch = !searchValue || 
      item.matkul.toLowerCase().includes(searchValue) ||
      item.kelas.toLowerCase().includes(searchValue) ||
      item.status.toLowerCase().includes(searchValue) ||
      item.keterangan.toLowerCase().includes(searchValue);

    // Status filter
    const statusMatch = !statusValue || item.status === statusValue;

    // Semester filter
    const semesterMatch = !semesterValue || item.semester === semesterValue;

    return searchMatch && statusMatch && semesterMatch;
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

    // Determine status class
    let statusClass = '';
    if (item.status === 'Hadir') {
      statusClass = 'status-hadir';
    } else if (item.status === 'Terlambat') {
      statusClass = 'status-terlambat';
    } else if (item.status === 'Izin') {
      statusClass = 'status-izin';
    } else if (item.status === 'Alfa') {
      statusClass = 'status-alfa';
    }

    row.innerHTML = `
      <td>${rowNumber}</td>
      <td>${item.tanggal}</td>
      <td>${item.matkul}</td>
      <td>${item.kelas}</td>
      <td>${item.jam}</td>
      <td><span class="status-badge ${statusClass}">${item.status}</span></td>
      <td>${item.keterangan}</td>
    `;

    tableBody.appendChild(row);
  });
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
