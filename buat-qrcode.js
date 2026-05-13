/* buat-qrcode.js
   Frontend-only page to generate QR Code for attendance
   - Checks auth (isLogin + role === 'Dosen')
   - Validates form, generates QR code via QRCode.js
   - Keeps history in-memory (frontend) and renders table
   - Provides simple download and view actions
*/
document.addEventListener('DOMContentLoaded', function () {
  // Auth guard
  if (localStorage.getItem('isLogin') !== 'true' || localStorage.getItem('role') !== 'Dosen') {
    alert('Akses hanya untuk Dosen');
    window.location.href = 'index.html';
    return;
  }

  // Elements
  const fldMatkul = document.getElementById('fldMatkul');
  const fldKelas = document.getElementById('fldKelas');
  const fldPertemuan = document.getElementById('fldPertemuan');
  const fldTanggal = document.getElementById('fldTanggal');
  const fldMulai = document.getElementById('fldMulai');
  const fldSelesai = document.getElementById('fldSelesai');
  const generateBtn = document.getElementById('generateBtn');
  const qrDetail = document.getElementById('qrDetail');
  const downloadBtn = document.getElementById('downloadBtn');
  const showBtn = document.getElementById('showBtn');
  const historyTbody = document.querySelector('#historyTable tbody');
  const navItems = document.querySelectorAll('.nav-item');
  const userArea = document.getElementById('userArea');
  const userMenu = document.getElementById('userMenu');
  const profileBtn = document.getElementById('profileBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // Initial history sample data
  const history = [
    { tanggal: '22 Mei 2024', matkul: 'Pemrograman Dasar', kelas: 'TI-1A', pertemuan: 'Pertemuan 8', masa: '08:00 - 09:40' },
    { tanggal: '22 Mei 2024', matkul: 'Struktur Data', kelas: 'TI-2A', pertemuan: 'Pertemuan 8', masa: '10:00 - 11:40' },
    { tanggal: '21 Mei 2024', matkul: 'Algoritma', kelas: 'SI-1A', pertemuan: 'Pertemuan 8', masa: '13:00 - 14:40' },
    { tanggal: '21 Mei 2024', matkul: 'Matematika Diskrit', kelas: 'TI-1B', pertemuan: 'Pertemuan 8', masa: '15:00 - 16:40' }
  ];

  let lastQRData = null; // object with fields
  const qrcodeDiv = document.getElementById('qrcode');

  // Render history table
  function renderHistory() {
    historyTbody.innerHTML = '';
    history.forEach((h, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${h.tanggal}</td>
        <td>${h.matkul}</td>
        <td>${h.kelas}</td>
        <td>${h.pertemuan}</td>
        <td>${h.masa}</td>
        <td>
          <button class="action-icon" data-index="${i}" data-action="download"><i class="fa-solid fa-download"></i></button>
          <button class="action-icon" data-index="${i}" data-action="view"><i class="fa-regular fa-eye"></i></button>
        </td>
      `;
      historyTbody.appendChild(tr);
    });
  }

  renderHistory();

  // Helper: clear preview
  function clearPreview() {
    qrcodeDiv.innerHTML = '<div class="placeholder">QR Code akan tampil di sini</div>';
    qrDetail.textContent = '';
    lastQRData = null;
  }

  clearPreview();

  // Generate handler
  generateBtn.addEventListener('click', function () {
    // Validate fields
    if (!fldMatkul.value || !fldKelas.value || !fldPertemuan.value || !fldTanggal.value || !fldMulai.value || !fldSelesai.value) {
      alert('Semua field wajib diisi');
      return;
    }

    const data = {
      matkul: fldMatkul.value,
      kelas: fldKelas.value,
      pertemuan: fldPertemuan.value,
      tanggal: fldTanggal.value,
      mulai: fldMulai.value,
      selesai: fldSelesai.value
    };

    // Build text payload
    const qrData = `${data.matkul}|${data.kelas}|${data.pertemuan}|${data.tanggal}|${data.mulai}|${data.selesai}`;

    // Clear existing QR code div
    qrcodeDiv.innerHTML = '';

    // Create QRCode
    new QRCode(document.getElementById('qrcode'), {
      text: qrData,
      width: 180,
      height: 180
    });

    // Save last data
    lastQRData = data;

    // Update detail text
    qrDetail.innerHTML = `
      <div><strong>Mata Kuliah:</strong> ${data.matkul}</div>
      <div><strong>Kelas:</strong> ${data.kelas}</div>
      <div><strong>Pertemuan:</strong> ${data.pertemuan}</div>
      <div><strong>Masa Berlaku:</strong> ${data.mulai} - ${data.selesai} (${data.tanggal})</div>
    `;

    // Add to history (prepend)
    history.unshift({ tanggal: formatDisplayDate(data.tanggal), matkul: data.matkul, kelas: data.kelas, pertemuan: data.pertemuan, masa: `${data.mulai} - ${data.selesai}` });
    renderHistory();
  });

  // Download: attempt to get img or canvas inside qrcode div
  downloadBtn.addEventListener('click', function () {
    if (!lastQRData) { alert('Belum ada QR Code untuk diunduh'); return; }
    // try img
    const img = qrcodeDiv.querySelector('img');
    if (img && img.src) {
      const a = document.createElement('a');
      a.href = img.src;
      a.download = `qrcode_${lastQRData.matkul}_${lastQRData.kelas}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
    // try canvas
    const canvas = qrcodeDiv.querySelector('canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `qrcode_${lastQRData.matkul}_${lastQRData.kelas}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
    alert('QR Code berhasil diproses untuk unduhan');
  });

  // Show details button
  showBtn.addEventListener('click', function () {
    if (!lastQRData) { alert('Belum ada QR Code untuk ditampilkan'); return; }
    alert(`Detail QR Code:\nMata Kuliah: ${lastQRData.matkul}\nKelas: ${lastQRData.kelas}\nPertemuan: ${lastQRData.pertemuan}\nTanggal: ${lastQRData.tanggal}\nWaktu: ${lastQRData.mulai} - ${lastQRData.selesai}`);
  });

  // History actions (delegation)
  historyTbody.addEventListener('click', function (e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const idx = parseInt(btn.dataset.index, 10);
    const action = btn.dataset.action;
    if (action === 'view') {
      const h = history[idx];
      alert(`Detail Riwayat:\n${h.tanggal} | ${h.matkul} | ${h.kelas} | ${h.pertemuan} | ${h.masa}`);
    } else if (action === 'download') {
      alert('QR Code berhasil diunduh');
    }
  });

  // Sidebar navigation
  navItems.forEach(item => {
    item.addEventListener('click', function () {
      const key = this.dataset.key;
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      if (key === 'dashboard') window.location.href = 'dosen-dashboard.html';
      else if (key === 'jadwal') window.location.href = 'jadwal-mengajar.html';
      else if (key === 'buat-qrcode') window.location.href = 'buat-qrcode.html';
      else if (key === 'rekap') window.location.href = 'rekap-absensi-dosen.html';
      else if (key === 'logout') { localStorage.removeItem('isLogin'); localStorage.removeItem('role'); window.location.href = 'index.html'; }
    });
  });

  // User dropdown
  userArea.addEventListener('click', function (e) { e.stopPropagation(); userMenu.style.display = userMenu.style.display === 'flex' ? 'none' : 'flex'; });
  document.addEventListener('click', () => userMenu.style.display = 'none');
  profileBtn.addEventListener('click', () => alert('Profil (placeholder)'));
  logoutBtn.addEventListener('click', () => { localStorage.removeItem('isLogin'); localStorage.removeItem('role'); window.location.href = 'index.html'; });

  // Utility: format date for display
  function formatDisplayDate(iso) {
    // try to parse YYYY-MM-DD -> display D MMM YYYY (simple)
    try {
      const parts = iso.split('-');
      if (parts.length !== 3) return iso;
      const y = parts[0], m = parts[1], d = parts[2];
      const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
      return `${parseInt(d,10)} ${months[parseInt(m,10)-1]} ${y}`;
    } catch (e) { return iso; }
  }
});
