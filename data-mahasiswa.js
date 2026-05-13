/* data-mahasiswa.js
   Client-side handling for Data Mahasiswa page:
   - Dummy auth check
   - Render static data, search, pagination
   - Add / Edit / Delete via modal
   - Sidebar and dropdown interactions
*/
document.addEventListener('DOMContentLoaded', function () {
  // Redirect to login if not logged-in
  if (localStorage.getItem('isLogin') !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  // Sample static data
  let students = [
    { nim: '2022101001', name: 'Andi Pratama', kelas: 'TI-1A', jurusan: 'Teknik Informatika', email: 'andi.pratama@email.ac.id' },
    { nim: '2022101002', name: 'Siti Nurhaliza', kelas: 'SI-2B', jurusan: 'Sistem Informasi', email: 'siti.nurhaliza@email.ac.id' },
    { nim: '2022101003', name: 'Budi Santoso', kelas: 'TI-2A', jurusan: 'Teknik Informatika', email: 'budi.santoso@email.ac.id' },
    { nim: '2022101004', name: 'Dewi Lestari', kelas: 'SI-1A', jurusan: 'Sistem Informasi', email: 'dewi.lestari@email.ac.id' },
    { nim: '2022101005', name: 'Rudi Haryono', kelas: 'TI-1B', jurusan: 'Teknik Informatika', email: 'rudi.haryono@email.ac.id' }
  ];

  // Pagination state
  let currentPage = 1;
  const pageSize = 5;

  // Elements
  const tbody = document.querySelector('#mahasiswaTable tbody');
  const searchInput = document.getElementById('searchInput');
  const addBtn = document.getElementById('addBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalForm = document.getElementById('modalForm');
  const modalTitle = document.getElementById('modalTitle');
  const cancelBtn = document.getElementById('cancelBtn');
  const mNIM = document.getElementById('mNIM');
  const mNama = document.getElementById('mNama');
  const mKelas = document.getElementById('mKelas');
  const mJurusan = document.getElementById('mJurusan');
  const mEmail = document.getElementById('mEmail');
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');
  const pageNumbers = document.getElementById('pageNumbers');
  const navItems = document.querySelectorAll('.nav-item');
  const logoutSidebar = document.querySelector('.nav-item[data-key="logout"]');

  // For edit state
  let editingIndex = -1; // index in filtered array

  // Render helpers
  function filterData(query) {
    if (!query) return students.slice();
    const q = query.toLowerCase();
    return students.filter(s => (
      s.nim.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.kelas.toLowerCase().includes(q) ||
      s.jurusan.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    ));
  }

  function renderTable() {
    const filtered = filterData(searchInput.value.trim());
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    tbody.innerHTML = '';
    pageItems.forEach((s, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${start + idx + 1}</td>
        <td>${s.nim}</td>
        <td>${s.name}</td>
        <td>${s.kelas}</td>
        <td>${s.jurusan}</td>
        <td>${s.email}</td>
        <td>
          <button class="action-btn action-edit" data-nim="${s.nim}">Edit</button>
          <button class="action-btn action-delete" data-nim="${s.nim}">Hapus</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Render pagination
    renderPagination(totalPages);
    // Attach action listeners
    attachRowActions();
  }

  function renderPagination(totalPages) {
    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      if (i === currentPage) btn.style.fontWeight = '700';
      btn.addEventListener('click', () => { currentPage = i; renderTable(); });
      pageNumbers.appendChild(btn);
    }
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;
  }

  prevPage.addEventListener('click', () => { if (currentPage>1) { currentPage--; renderTable(); } });
  nextPage.addEventListener('click', () => { currentPage++; renderTable(); });

  function attachRowActions() {
    document.querySelectorAll('.action-edit').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.dataset.nim));
    });
    document.querySelectorAll('.action-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteStudent(btn.dataset.nim));
    });
  }

  // Modal functions
  function openAddModal() {
    editingIndex = -1;
    modalTitle.textContent = 'Tambah Mahasiswa';
    mNIM.value = '';
    mNama.value = '';
    mKelas.value = '';
    mJurusan.value = '';
    mEmail.value = '';
    modalBackdrop.style.display = 'flex';
    modalBackdrop.setAttribute('aria-hidden', 'false');
  }

  function openEditModal(nim) {
    const idx = students.findIndex(s => s.nim === nim);
    if (idx === -1) return;
    editingIndex = idx;
    modalTitle.textContent = 'Edit Mahasiswa';
    const s = students[idx];
    mNIM.value = s.nim;
    mNama.value = s.name;
    mKelas.value = s.kelas;
    mJurusan.value = s.jurusan;
    mEmail.value = s.email;
    modalBackdrop.style.display = 'flex';
    modalBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modalBackdrop.style.display = 'none';
    modalBackdrop.setAttribute('aria-hidden', 'true');
  }

  modalForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const newData = {
      nim: mNIM.value.trim(),
      name: mNama.value.trim(),
      kelas: mKelas.value.trim(),
      jurusan: mJurusan.value.trim(),
      email: mEmail.value.trim()
    };
    if (editingIndex >= 0) {
      // edit
      students[editingIndex] = newData;
    } else {
      // add
      students.unshift(newData); // add to top
      currentPage = 1;
    }
    closeModal();
    renderTable();
  });

  cancelBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', function (e) {
    if (e.target === modalBackdrop) closeModal();
  });

  function deleteStudent(nim) {
    if (!confirm('Apakah Anda yakin ingin menghapus data mahasiswa ini?')) return;
    students = students.filter(s => s.nim !== nim);
    renderTable();
  }

  // Search
  searchInput.addEventListener('input', function () { currentPage = 1; renderTable(); });

  // Add button
  addBtn.addEventListener('click', openAddModal);

  // Sidebar interactions
  navItems.forEach(item => {
    item.addEventListener('click', function () {
      const key = this.dataset.key;
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      
      if (key === 'dashboard') { window.location.href = 'admin-dashboard.html'; return; }
      if (key === 'mahasiswa') { window.location.href = 'data-mahasiswa.html'; return; }
      if (key === 'dosen') { window.location.href = 'data-dosen.html'; return; }
      if (key === 'matakuliah') { window.location.href = 'mata-kuliah.html'; return; }
      if (key === 'jadwal') { window.location.href = 'jadwal.html'; return; }
      if (key === 'laporan') { window.location.href = 'laporan-absensi.html'; return; }
      if (key === 'logout') { localStorage.removeItem('isLogin'); window.location.href = 'index.html'; return; }
    });
  });

  // Sidebar logout also handled above

  // User dropdown and logout
  const userArea = document.getElementById('userArea');
  const userMenu = document.getElementById('userMenu');
  const profileBtn = document.getElementById('profileBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  userArea.addEventListener('click', function (e) {
    e.stopPropagation();
    userMenu.style.display = userMenu.style.display === 'flex' ? 'none' : 'flex';
  });
  document.addEventListener('click', function () { userMenu.style.display = 'none'; });
  profileBtn.addEventListener('click', function () { alert('Profil (placeholder)'); });
  logoutBtn.addEventListener('click', function () { localStorage.removeItem('isLogin'); window.location.href = 'index.html'; });

  // Initial render
  renderTable();
});
