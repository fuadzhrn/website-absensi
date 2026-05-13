/* scan-qrcode.js
   Frontend page for Mahasiswa Scan QR Code
   - Checks auth (isLogin + role === 'Mahasiswa')
   - Simulates QR Code scanning
   - Updates attendance info
   - Handles file upload
*/
document.addEventListener('DOMContentLoaded', function () {
  // Auth guard: must be logged in as Mahasiswa
  if (localStorage.getItem('isLogin') !== 'true' || localStorage.getItem('role') !== 'Mahasiswa') {
    alert('Akses hanya untuk Mahasiswa');
    window.location.href = 'index.html';
    return;
  }

  // Elements
  const scanBtn = document.getElementById('scanBtn');
  const uploadBtn = document.getElementById('uploadBtn');
  const fileInput = document.getElementById('fileInput');
  const scanStatus = document.getElementById('scanStatus');
  const scanMessage = document.getElementById('scanMessage');
  const infoMatkul = document.getElementById('infoMatkul');
  const infoKelas = document.getElementById('infoKelas');
  const infoPertemuan = document.getElementById('infoPertemuan');
  const infoWaktu = document.getElementById('infoWaktu');
  const infoStatus = document.getElementById('infoStatus');
  const navItems = document.querySelectorAll('.nav-item');
  const userArea = document.getElementById('userArea');
  const userMenu = document.getElementById('userMenu');
  const profileBtn = document.getElementById('profileBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // Dummy scanned data
  const dummyQRData = {
    matkul: 'Pemrograman Dasar',
    kelas: 'TI-1A',
    pertemuan: 'Pertemuan 8',
    waktu: '08:05'
  };

  // Process scan (simulated)
  function processScan() {
    // Set status to processing
    scanStatus.textContent = 'Memindai QR Code...';
    scanStatus.classList.add('processing');
    scanBtn.disabled = true;
    uploadBtn.disabled = true;

    // Simulate scan delay (1-2 seconds)
    setTimeout(function () {
      // Show alert
      alert('QR Code berhasil dipindai');

      // Update info
      infoMatkul.textContent = dummyQRData.matkul;
      infoKelas.textContent = dummyQRData.kelas;
      infoPertemuan.textContent = dummyQRData.pertemuan;
      infoWaktu.textContent = dummyQRData.waktu;
      
      // Update status
      infoStatus.textContent = 'Hadir';
      infoStatus.classList.remove('waiting');
      infoStatus.classList.add('present');

      // Update scan status
      scanStatus.textContent = 'Absensi berhasil diproses';
      scanStatus.classList.remove('processing');
      scanStatus.classList.add('success');

      // Show success message
      scanMessage.innerHTML = '<i class="fa-solid fa-check-circle"></i> Absensi berhasil disimpan secara frontend';

      // Keep buttons enabled for retry
      scanBtn.disabled = false;
      uploadBtn.disabled = false;
    }, 1500);
  }

  // Scan button click
  scanBtn.addEventListener('click', function () {
    processScan();
  });

  // Upload button click
  uploadBtn.addEventListener('click', function () {
    fileInput.click();
  });

  // File input change
  fileInput.addEventListener('change', function (e) {
    if (e.target.files && e.target.files.length > 0) {
      alert('Gambar QR Code berhasil diunggah');
      // Simulate scan result
      processScan();
    }
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

  profileBtn.addEventListener('click', function () {
    alert('Profil Mahasiswa (placeholder)');
  });

  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('isLogin');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
  });
});
