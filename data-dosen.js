/* data-dosen.js
   Frontend logic for Admin Data Dosen page
   - Authentication check
   - CRUD operations for dosen data
   - Search and filter functionality
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
  initializeDataDosen();
});

// Dummy dosen data
const dosenData = [
  {
    nidn: '1020018501',
    nama: 'Budi Santoso, S.Kom.',
    email: 'budi.santoso@email.ac.id',
    telepon: '081234567890',
    matkul: 'Pemrograman Dasar'
  },
  {
    nidn: '1020028602',
    nama: 'Dewi Lestari, M.Kom.',
    email: 'dewi.lestari@email.ac.id',
    telepon: '081234567891',
    matkul: 'Basis Data'
  },
  {
    nidn: '1020038703',
    nama: 'Rudi Haryono, M.T.',
    email: 'rudi.haryono@email.ac.id',
    telepon: '081234567892',
    matkul: 'Struktur Data'
  },
  {
    nidn: '1020048804',
    nama: 'Ahmad Pratama, S.Kom.',
    email: 'ahmad.pratama@email.ac.id',
    telepon: '081234567893',
    matkul: 'Algoritma'
  },
  {
    nidn: '1020058905',
    nama: 'Siti Aminah, M.Kom.',
    email: 'siti.aminah@email.ac.id',
    telepon: '081234567894',
    matkul: 'Matematika Diskrit'
  }
];

// Pagination
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [...dosenData];
let editingIndex = -1;

function initializeDataDosen() {
  // Get DOM elements
  const searchInput = document.getElementById('searchInput');
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

  // Search functionality
  searchInput.addEventListener('input', function () {
    applySearch();
  });

  // Add button
  addBtn.addEventListener('click', function () {
    editingIndex = -1;
    document.getElementById('modalTitle').textContent = 'Tambah Dosen';
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
 * Apply search filter
 */
function applySearch() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();

  filteredData = dosenData.filter(item => {
    return (
      item.nidn.toLowerCase().includes(searchValue) ||
      item.nama.toLowerCase().includes(searchValue) ||
      item.email.toLowerCase().includes(searchValue) ||
      item.telepon.toLowerCase().includes(searchValue) ||
      item.matkul.toLowerCase().includes(searchValue)
    );
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
    const actualIndex = dosenData.findIndex(d => d.nidn === item.nidn);

    row.innerHTML = `
      <td>${rowNumber}</td>
      <td>${item.nidn}</td>
      <td>${item.nama}</td>
      <td>${item.email}</td>
      <td>${item.telepon}</td>
      <td>${item.matkul}</td>
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
      editDosen(index);
    });
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', function () {
      const index = parseInt(this.dataset.index);
      deleteDosen(index);
    });
  });
}

/**
 * Edit dosen
 */
function editDosen(index) {
  const item = dosenData[index];
  editingIndex = index;

  document.getElementById('modalTitle').textContent = 'Edit Dosen';
  document.getElementById('formNIDN').value = item.nidn;
  document.getElementById('formNama').value = item.nama;
  document.getElementById('formEmail').value = item.email;
  document.getElementById('formTelepon').value = item.telepon;
  document.getElementById('formMatkul').value = item.matkul;

  document.getElementById('modalOverlay').style.display = 'flex';
}

/**
 * Delete dosen
 */
function deleteDosen(index) {
  if (confirm('Apakah Anda yakin ingin menghapus data dosen ini?')) {
    dosenData.splice(index, 1);
    filteredData = [...dosenData];
    currentPage = 1;
    renderTable();
    renderPagination();
  }
}

/**
 * Reset form fields
 */
function resetForm() {
  document.getElementById('formNIDN').value = '';
  document.getElementById('formNama').value = '';
  document.getElementById('formEmail').value = '';
  document.getElementById('formTelepon').value = '';
  document.getElementById('formMatkul').value = '';
}

/**
 * Submit form
 */
function submitForm() {
  const nidn = document.getElementById('formNIDN').value.trim();
  const nama = document.getElementById('formNama').value.trim();
  const email = document.getElementById('formEmail').value.trim();
  const telepon = document.getElementById('formTelepon').value.trim();
  const matkul = document.getElementById('formMatkul').value.trim();

  // Validation
  if (!nidn || !nama || !email || !telepon || !matkul) {
    alert('Semua field harus diisi');
    return;
  }

  if (editingIndex === -1) {
    // Add new dosen
    dosenData.push({
      nidn,
      nama,
      email,
      telepon,
      matkul
    });
  } else {
    // Edit existing dosen
    dosenData[editingIndex] = {
      nidn,
      nama,
      email,
      telepon,
      matkul
    };
  }

  // Reset and close
  filteredData = [...dosenData];
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
