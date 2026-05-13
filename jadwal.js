/* jadwal.js
   Frontend logic for Admin Jadwal Perkuliahan page
   - Authentication check
   - CRUD operations for jadwal data
   - Search and hari filter functionality
   - Modal form handling
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
  initializeJadwal();
});

// Dummy jadwal data
const jadwalData = [
  {
    hari: 'Senin',
    matkul: 'Pemrograman Dasar',
    dosen: 'Budi Santoso, S.Kom.',
    kelas: 'TI-1A',
    jamMulai: '08:00',
    jamSelesai: '09:40',
    ruangan: 'Lab. Komputer 1'
  },
  {
    hari: 'Selasa',
    matkul: 'Basis Data',
    dosen: 'Dewi Lestari, M.Kom.',
    kelas: 'SI-2B',
    jamMulai: '10:00',
    jamSelesai: '11:40',
    ruangan: 'R. 204'
  },
  {
    hari: 'Rabu',
    matkul: 'Struktur Data',
    dosen: 'Rudi Haryono, M.T.',
    kelas: 'TI-2A',
    jamMulai: '10:00',
    jamSelesai: '11:40',
    ruangan: 'R. 201'
  },
  {
    hari: 'Kamis',
    matkul: 'Algoritma',
    dosen: 'Ahmad Pratama, S.Kom.',
    kelas: 'SI-1A',
    jamMulai: '13:00',
    jamSelesai: '14:40',
    ruangan: 'Lab. Komputer 2'
  },
  {
    hari: 'Jumat',
    matkul: 'Matematika Diskrit',
    dosen: 'Siti Aminah, M.Kom.',
    kelas: 'TI-1B',
    jamMulai: '15:00',
    jamSelesai: '16:40',
    ruangan: 'R. 203'
  }
];

// Pagination
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [...jadwalData];
let editingIndex = -1;

function initializeJadwal() {
  // Get DOM elements
  const searchInput = document.getElementById('searchInput');
  const hariFilter = document.getElementById('hariFilter');
  const addBtn = document.getElementById('addBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const submitBtn = document.getElementById('submitBtn');
  const navItems = document.querySelectorAll('.nav-item');
  const userArea = document.getElementById('userArea');
  const userMenu = document.getElementById('userMenu');
  const profileBtn = document.getElementById('profileBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // Render initial data
  renderTable();
  renderPagination();

  // Search and filter functionality
  searchInput.addEventListener('input', function () {
    applyFilters();
  });

  hariFilter.addEventListener('change', function () {
    applyFilters();
  });

  // Add button
  addBtn.addEventListener('click', function () {
    editingIndex = -1;
    document.getElementById('modalTitle').textContent = 'Tambah Jadwal';
    resetForm();
    modalOverlay.style.display = 'flex';
  });

  // Modal close
  modalClose.addEventListener('click', function () {
    modalOverlay.style.display = 'none';
  });

  cancelBtn.addEventListener('click', function () {
    modalOverlay.style.display = 'none';
  });

  // Modal overlay click outside
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = 'none';
    }
  });

  // Submit form
  submitBtn.addEventListener('click', function () {
    submitForm();
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
      } else if (key === 'matakuliah') {
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

  profileBtn.addEventListener('click', function () {
    alert('Profil Admin (placeholder)');
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
 * Apply search and filter
 */
function applyFilters() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const hariValue = document.getElementById('hariFilter').value;

  filteredData = jadwalData.filter(item => {
    // Search filter
    const searchMatch = !searchValue ||
      item.hari.toLowerCase().includes(searchValue) ||
      item.matkul.toLowerCase().includes(searchValue) ||
      item.dosen.toLowerCase().includes(searchValue) ||
      item.kelas.toLowerCase().includes(searchValue) ||
      item.jamMulai.includes(searchValue) ||
      item.jamSelesai.includes(searchValue) ||
      item.ruangan.toLowerCase().includes(searchValue);

    // Hari filter
    const hariMatch = !hariValue || item.hari === hariValue;

    return searchMatch && hariMatch;
  });

  currentPage = 1;
  renderTable();
  renderPagination();
}

/**
 * Render table rows
 */
function renderTable() {
  const tableBody = document.getElementById('tableBody');
  const emptyState = document.getElementById('emptyState');

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Clear table
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
    const actualIndex = jadwalData.findIndex(j => j.hari === item.hari && j.matkul === item.matkul);

    row.innerHTML = `
      <td>${rowNumber}</td>
      <td>${item.hari}</td>
      <td>${item.matkul}</td>
      <td>${item.dosen}</td>
      <td>${item.kelas}</td>
      <td>${item.jamMulai}</td>
      <td>${item.jamSelesai}</td>
      <td>${item.ruangan}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-action btn-edit" data-index="${actualIndex}">
            <i class="fa-solid fa-pen"></i> Edit
          </button>
          <button class="btn-action btn-delete" data-index="${actualIndex}">
            <i class="fa-solid fa-trash"></i> Hapus
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Attach event listeners
  attachActionListeners();
}

/**
 * Attach action button event listeners
 */
function attachActionListeners() {
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', function () {
      const index = parseInt(this.dataset.index);
      editJadwal(index);
    });
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', function () {
      const index = parseInt(this.dataset.index);
      deleteJadwal(index);
    });
  });
}

/**
 * Edit jadwal
 */
function editJadwal(index) {
  const item = jadwalData[index];
  editingIndex = index;

  document.getElementById('modalTitle').textContent = 'Edit Jadwal';
  document.getElementById('formHari').value = item.hari;
  document.getElementById('formMatkul').value = item.matkul;
  document.getElementById('formDosen').value = item.dosen;
  document.getElementById('formKelas').value = item.kelas;
  document.getElementById('formJamMulai').value = item.jamMulai;
  document.getElementById('formJamSelesai').value = item.jamSelesai;
  document.getElementById('formRuangan').value = item.ruangan;

  document.getElementById('modalOverlay').style.display = 'flex';
}

/**
 * Delete jadwal
 */
function deleteJadwal(index) {
  if (confirm('Apakah Anda yakin ingin menghapus data jadwal ini?')) {
    jadwalData.splice(index, 1);
    filteredData = [...jadwalData];
    currentPage = 1;
    renderTable();
    renderPagination();
  }
}

/**
 * Reset form fields
 */
function resetForm() {
  document.getElementById('formHari').value = '';
  document.getElementById('formMatkul').value = '';
  document.getElementById('formDosen').value = '';
  document.getElementById('formKelas').value = '';
  document.getElementById('formJamMulai').value = '';
  document.getElementById('formJamSelesai').value = '';
  document.getElementById('formRuangan').value = '';
}

/**
 * Submit form
 */
function submitForm() {
  const hari = document.getElementById('formHari').value.trim();
  const matkul = document.getElementById('formMatkul').value.trim();
  const dosen = document.getElementById('formDosen').value.trim();
  const kelas = document.getElementById('formKelas').value.trim();
  const jamMulai = document.getElementById('formJamMulai').value.trim();
  const jamSelesai = document.getElementById('formJamSelesai').value.trim();
  const ruangan = document.getElementById('formRuangan').value.trim();

  // Validation
  if (!hari || !matkul || !dosen || !kelas || !jamMulai || !jamSelesai || !ruangan) {
    alert('Semua field harus diisi');
    return;
  }

  if (editingIndex === -1) {
    // Add new jadwal
    jadwalData.push({
      hari,
      matkul,
      dosen,
      kelas,
      jamMulai,
      jamSelesai,
      ruangan
    });
  } else {
    // Edit existing jadwal
    jadwalData[editingIndex] = {
      hari,
      matkul,
      dosen,
      kelas,
      jamMulai,
      jamSelesai,
      ruangan
    };
  }

  // Reset and close
  filteredData = [...jadwalData];
  currentPage = 1;
  renderTable();
  renderPagination();
  document.getElementById('modalOverlay').style.display = 'none';
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

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

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

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}
