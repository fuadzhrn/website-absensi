/* laporan-absensi.js
   Frontend logic for Admin Laporan Absensi page
   - Authentication check
   - Filter and search functionality
   - Pagination
   - Print functionality
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

  // Cek role admin
  if (localStorage.getItem('role') !== 'Admin') {
    alert('Akses hanya untuk Admin');
    window.location.href = 'index.html';
    return;
  }

  // Initialize page
  initializeLaporanAbsensi();
});

// Dummy data for attendance report
const attendanceReportData = [
  {
    no: 1,
    nim: '2022101001',
    nama: 'Andi Pratama',
    matkul: 'Pemrograman Dasar',
    kelas: 'TI-1A',
    tanggal: '22 Mei 2024',
    jam: '08:05',
    status: 'Hadir'
  },
  {
    no: 2,
    nim: '2022101002',
    nama: 'Siti Nurhaliza',
    matkul: 'Pemrograman Dasar',
    kelas: 'TI-1A',
    tanggal: '22 Mei 2024',
    jam: '08:12',
    status: 'Hadir'
  },
  {
    no: 3,
    nim: '2022101003',
    nama: 'Budi Santoso',
    matkul: 'Pemrograman Dasar',
    kelas: 'TI-1A',
    tanggal: '22 Mei 2024',
    jam: '08:20',
    status: 'Terlambat'
  },
  {
    no: 4,
    nim: '2022101004',
    nama: 'Dewi Lestari',
    matkul: 'Pemrograman Dasar',
    kelas: 'TI-1A',
    tanggal: '22 Mei 2024',
    jam: '-',
    status: 'Izin'
  },
  {
    no: 5,
    nim: '2022101005',
    nama: 'Rudi Haryono',
    matkul: 'Pemrograman Dasar',
    kelas: 'TI-1A',
    tanggal: '22 Mei 2024',
    jam: '-',
    status: 'Alfa'
  },
  {
    no: 6,
    nim: '2022101006',
    nama: 'Ahmad Rifaldi',
    matkul: 'Basis Data',
    kelas: 'SI-2B',
    tanggal: '23 Mei 2024',
    jam: '10:05',
    status: 'Hadir'
  },
  {
    no: 7,
    nim: '2022101007',
    nama: 'Nur Aisyah',
    matkul: 'Algoritma',
    kelas: 'SI-1A',
    tanggal: '24 Mei 2024',
    jam: '13:15',
    status: 'Terlambat'
  },
  {
    no: 8,
    nim: '2022101008',
    nama: 'Muhammad Rizki',
    matkul: 'Struktur Data',
    kelas: 'TI-1B',
    tanggal: '25 Mei 2024',
    jam: '09:00',
    status: 'Hadir'
  },
  {
    no: 9,
    nim: '2022101009',
    nama: 'Ratna Sari',
    matkul: 'Matematika Diskrit',
    kelas: 'TI-2A',
    tanggal: '26 Mei 2024',
    jam: '-',
    status: 'Alfa'
  },
  {
    no: 10,
    nim: '2022101010',
    nama: 'Dewa Putra',
    matkul: 'Pemrograman Dasar',
    kelas: 'TI-1B',
    tanggal: '22 Mei 2024',
    jam: '08:05',
    status: 'Hadir'
  }
];

// Pagination
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [...attendanceReportData];

function initializeLaporanAbsensi() {
  // Get DOM elements
  const matkulFilter = document.getElementById('matkulFilter');
  const kelasFilter = document.getElementById('kelasFilter');
  const tanggalFilter = document.getElementById('tanggalFilter');
  const filterBtn = document.getElementById('filterBtn');
  const printBtn = document.getElementById('printBtn');
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

  // Real-time filter on change
  matkulFilter.addEventListener('change', function () {
    applyFilters();
  });

  kelasFilter.addEventListener('change', function () {
    applyFilters();
  });

  tanggalFilter.addEventListener('change', function () {
    applyFilters();
  });

  // Print button
  printBtn.addEventListener('click', function () {
    window.print();
  });

  // Sidebar navigation
  navItems.forEach(item => {
    item.addEventListener('click', function () {
      const key = this.dataset.key;
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');

      if (key === 'dashboard') {
        window.location.href = 'admin-dashboard.html';
      } else if (key === 'mahasiswa') {
        window.location.href = 'data-mahasiswa.html';
      } else if (key === 'dosen') {
        window.location.href = 'data-dosen.html';
      } else if (key === 'matkul') {
        window.location.href = 'mata-kuliah.html';
      } else if (key === 'jadwal') {
        window.location.href = 'jadwal.html';
      } else if (key === 'laporan') {
        window.location.href = 'laporan-absensi.html';
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
    alert('Profil Admin (Halaman profil belum tersedia)');
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
 * Apply all active filters (matkul, kelas, tanggal)
 */
function applyFilters() {
  const matkulValue = document.getElementById('matkulFilter').value;
  const kelasValue = document.getElementById('kelasFilter').value;
  const tanggalValue = document.getElementById('tanggalFilter').value;

  // Filter data
  filteredData = attendanceReportData.filter(item => {
    // Mata kuliah filter
    const matkulMatch = !matkulValue || item.matkul === matkulValue;

    // Kelas filter
    const kelasMatch = !kelasValue || item.kelas === kelasValue;

    // Tanggal filter (convert 22 Mei 2024 to date format for comparison)
    let tanggalMatch = true;
    if (tanggalValue) {
      const selectedDate = new Date(tanggalValue);
      const itemDateStr = item.tanggal; // e.g., "22 Mei 2024"
      const itemDate = parseDateString(itemDateStr);
      
      tanggalMatch = itemDate && 
        itemDate.getFullYear() === selectedDate.getFullYear() &&
        itemDate.getMonth() === selectedDate.getMonth() &&
        itemDate.getDate() === selectedDate.getDate();
    }

    return matkulMatch && kelasMatch && tanggalMatch;
  });

  // Reset to page 1 when filter changes
  currentPage = 1;

  // Render table and pagination
  renderTable();
  renderPagination();
}

/**
 * Parse date string like "22 Mei 2024" to Date object
 */
function parseDateString(dateStr) {
  const monthNames = {
    'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3,
    'Mei': 4, 'Juni': 5, 'Juli': 6, 'Agustus': 7,
    'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
  };

  const parts = dateStr.split(' ');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0]);
  const month = monthNames[parts[1]];
  const year = parseInt(parts[2]);

  if (month === undefined) return null;

  return new Date(year, month, day);
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
      <td>${item.nim}</td>
      <td>${item.nama}</td>
      <td>${item.matkul}</td>
      <td>${item.kelas}</td>
      <td>${item.tanggal}</td>
      <td>${item.jam}</td>
      <td><span class="status-badge ${statusClass}">${item.status}</span></td>
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
