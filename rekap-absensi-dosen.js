/* rekap-absensi-dosen.js
   Frontend logic for Dosen Rekap Absensi page
   - Authentication check
   - Attendance recap table rendering
   - Filter and search functionality
   - Pagination
   - Statistics and summary
   - Print and export functionality
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
  initializeRekapAbsensi();
});

// Dummy attendance data
const attendanceData = [
  {
    nim: '2022101001',
    nama: 'Andi Pratama',
    matkul: 'Pemrograman Dasar',
    kelas: 'TI-1A',
    pertemuan: 'Pertemuan 8',
    tanggal: '22 Mei 2024',
    jamAbsen: '08:05',
    status: 'Hadir',
    keterangan: 'Tepat waktu'
  },
  {
    nim: '2022101002',
    nama: 'Siti Nurhaliza',
    matkul: 'Pemrograman Dasar',
    kelas: 'TI-1A',
    pertemuan: 'Pertemuan 8',
    tanggal: '22 Mei 2024',
    jamAbsen: '08:12',
    status: 'Hadir',
    keterangan: 'Tepat waktu'
  },
  {
    nim: '2022101003',
    nama: 'Budi Santoso',
    matkul: 'Pemrograman Dasar',
    kelas: 'TI-1A',
    pertemuan: 'Pertemuan 8',
    tanggal: '22 Mei 2024',
    jamAbsen: '08:20',
    status: 'Terlambat',
    keterangan: 'Masuk 10 menit terlambat'
  },
  {
    nim: '2022101004',
    nama: 'Dewi Lestari',
    matkul: 'Pemrograman Dasar',
    kelas: 'TI-1A',
    pertemuan: 'Pertemuan 8',
    tanggal: '22 Mei 2024',
    jamAbsen: '-',
    status: 'Izin',
    keterangan: 'Izin sakit'
  },
  {
    nim: '2022101005',
    nama: 'Rudi Haryono',
    matkul: 'Pemrograman Dasar',
    kelas: 'TI-1A',
    pertemuan: 'Pertemuan 8',
    tanggal: '22 Mei 2024',
    jamAbsen: '-',
    status: 'Alfa',
    keterangan: 'Tidak hadir'
  },
  {
    nim: '2022101006',
    nama: 'Ahmad Rifaldi',
    matkul: 'Struktur Data',
    kelas: 'TI-2A',
    pertemuan: 'Pertemuan 8',
    tanggal: '22 Mei 2024',
    jamAbsen: '10:05',
    status: 'Hadir',
    keterangan: 'Tepat waktu'
  },
  {
    nim: '2022101007',
    nama: 'Nur Aisyah',
    matkul: 'Algoritma',
    kelas: 'SI-1A',
    pertemuan: 'Pertemuan 8',
    tanggal: '21 Mei 2024',
    jamAbsen: '13:10',
    status: 'Hadir',
    keterangan: 'Tepat waktu'
  }
];

// Pagination
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [...attendanceData];

// Filter state
let filterState = {
  matkul: '',
  kelas: '',
  pertemuan: '',
  tanggal: ''
};

function initializeRekapAbsensi() {
  // Get DOM elements
  const matkulFilter = document.getElementById('matkulFilter');
  const kelasFilter = document.getElementById('kelasFilter');
  const pertemuanFilter = document.getElementById('pertemuanFilter');
  const tanggalFilter = document.getElementById('tanggalFilter');
  const filterBtn = document.getElementById('filterBtn');
  const printBtn = document.getElementById('printBtn');
  const exportBtn = document.getElementById('exportBtn');
  const navItems = document.querySelectorAll('.nav-item');
  const userArea = document.getElementById('userArea');
  const userMenu = document.getElementById('userMenu');
  const profileBtn = document.getElementById('profileBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // Render initial data
  renderTable();
  renderPagination();
  updateStatistics();
  updateRingkasan();

  // Filter button click
  filterBtn.addEventListener('click', function () {
    applyFilters();
  });

  // Filter changes (real-time or on button click)
  matkulFilter.addEventListener('change', function () {
    filterState.matkul = this.value;
  });

  kelasFilter.addEventListener('change', function () {
    filterState.kelas = this.value;
  });

  pertemuanFilter.addEventListener('change', function () {
    filterState.pertemuan = this.value;
  });

  tanggalFilter.addEventListener('change', function () {
    filterState.tanggal = this.value;
  });

  // Print button
  printBtn.addEventListener('click', function () {
    window.print();
  });

  // Export button
  exportBtn.addEventListener('click', function () {
    exportToCSV();
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
 * Apply all active filters (matkul, kelas, pertemuan, tanggal)
 */
function applyFilters() {
  const matkulValue = filterState.matkul;
  const kelasValue = filterState.kelas;
  const pertemuanValue = filterState.pertemuan;
  const tanggalValue = filterState.tanggal;

  // Filter data
  filteredData = attendanceData.filter(item => {
    // Matkul filter
    const matkulMatch = !matkulValue || item.matkul === matkulValue;

    // Kelas filter
    const kelasMatch = !kelasValue || item.kelas === kelasValue;

    // Pertemuan filter
    const pertemuanMatch = !pertemuanValue || item.pertemuan === pertemuanValue;

    // Tanggal filter
    const tanggalMatch = !tanggalValue || item.tanggal === formatTanggalFromInput(tanggalValue);

    return matkulMatch && kelasMatch && pertemuanMatch && tanggalMatch;
  });

  // Reset to page 1 when filter changes
  currentPage = 1;

  // Render table, pagination, and update statistics
  renderTable();
  renderPagination();
  updateStatistics();
  updateRingkasan();
}

/**
 * Convert date input (YYYY-MM-DD) to display format (DD Bulan YYYY)
 */
function formatTanggalFromInput(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString + 'T00:00:00');
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formatted = date.toLocaleDateString('id-ID', options);
  // Capitalize first letter of month
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
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

    // Determine status badge class
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
      <td>${item.pertemuan}</td>
      <td>${item.tanggal}</td>
      <td>${item.jamAbsen}</td>
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

/**
 * Update statistics cards based on filtered data
 */
function updateStatistics() {
  const hadir = filteredData.filter(item => item.status === 'Hadir').length;
  const terlambat = filteredData.filter(item => item.status === 'Terlambat').length;
  const izin = filteredData.filter(item => item.status === 'Izin').length;
  const alfa = filteredData.filter(item => item.status === 'Alfa').length;
  const totalMahasiswa = filteredData.length;
  const tidakHadir = izin + alfa;

  document.getElementById('totalMahasiswa').textContent = totalMahasiswa;
  document.getElementById('statHadir').textContent = hadir;
  document.getElementById('statTerlambat').textContent = terlambat;
  document.getElementById('statTidakHadir').textContent = tidakHadir;
}

/**
 * Update ringkasan kelas based on filtered data
 */
function updateRingkasan() {
  if (filteredData.length === 0) {
    // Reset to default values
    document.getElementById('ringkasanMatkul').textContent = 'Pemrograman Dasar';
    document.getElementById('ringkasanKelas').textContent = 'TI-1A';
    document.getElementById('ringkasanPertemuan').textContent = 'Pertemuan 8';
    document.getElementById('ringkasanTanggal').textContent = '22 Mei 2024';
    document.getElementById('ringkasanTotal').textContent = '0';
    document.getElementById('ringkasanHadir').textContent = '0';
    document.getElementById('ringkasanTerlambat').textContent = '0';
    document.getElementById('ringkasanIzin').textContent = '0';
    document.getElementById('ringkasanAlfa').textContent = '0';
    document.getElementById('progressValue').textContent = '0%';
    document.getElementById('progressFill').style.width = '0%';
    return;
  }

  // Get info from first row
  const firstData = filteredData[0];
  const hadir = filteredData.filter(item => item.status === 'Hadir').length;
  const terlambat = filteredData.filter(item => item.status === 'Terlambat').length;
  const izin = filteredData.filter(item => item.status === 'Izin').length;
  const alfa = filteredData.filter(item => item.status === 'Alfa').length;
  const totalMahasiswa = filteredData.length;

  // Calculate attendance percentage
  const hadirRate = (hadir + terlambat) / totalMahasiswa * 100;
  const hadirRateFixed = hadirRate.toFixed(2);

  // Update ringkasan
  document.getElementById('ringkasanMatkul').textContent = firstData.matkul;
  document.getElementById('ringkasanKelas').textContent = firstData.kelas;
  document.getElementById('ringkasanPertemuan').textContent = firstData.pertemuan;
  document.getElementById('ringkasanTanggal').textContent = firstData.tanggal;
  document.getElementById('ringkasanTotal').textContent = totalMahasiswa;
  document.getElementById('ringkasanHadir').textContent = hadir;
  document.getElementById('ringkasanTerlambat').textContent = terlambat;
  document.getElementById('ringkasanIzin').textContent = izin;
  document.getElementById('ringkasanAlfa').textContent = alfa;
  document.getElementById('progressValue').textContent = hadirRateFixed + '%';
  document.getElementById('progressFill').style.width = hadirRateFixed + '%';
}

/**
 * Export table data to CSV format
 */
function exportToCSV() {
  // Create CSV header
  const headers = ['No', 'NIM', 'Nama Mahasiswa', 'Mata Kuliah', 'Kelas', 'Pertemuan', 'Tanggal', 'Jam Absen', 'Status', 'Keterangan'];
  let csvContent = headers.join(',') + '\n';

  // Add data rows
  filteredData.forEach((item, index) => {
    const row = [
      index + 1,
      item.nim,
      `"${item.nama}"`,
      `"${item.matkul}"`,
      item.kelas,
      `"${item.pertemuan}"`,
      item.tanggal,
      item.jamAbsen,
      item.status,
      `"${item.keterangan}"`
    ];
    csvContent += row.join(',') + '\n';
  });

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'rekap-absensi.csv');
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
