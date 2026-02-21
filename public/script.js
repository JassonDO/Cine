const defaultDeadline = {
  "C-41": "24h",
  "Cine": "72h",
  "BW": "72h",
  "APS": "72h",
  "E6": "14d",
  "BW-120": "72h",
  "C-41-120": "24h",
  "Rescan": "24h",
  "8mm": "14d"
};

const servicesDiv = document.getElementById("services");

// HÀM THÊM DÒNG DỊCH VỤ
function addService() {
  const row = document.createElement("div");
  row.className = "service-row";

  row.innerHTML = `
    <!-- MÃ HÓA ĐƠN -->
    <input type="text" class="rcode" placeholder="Mã HĐ" style="width:100px">

    <!-- LOẠI FILM -->
    <select class="film">
      <option value="C-41">C-41</option>
      <option value="Cine">Cine</option>
      <option value="BW">BW</option>
      <option value="C-41-120">C-41 120</option>
      <option value="BW-120">BW 120</option>
      <option value="APS">APS</option>
      <option value="E6">E6</option>
      <option value="Rescan">Rescan</option>
    </select>

    <!-- SỐ LƯỢNG -->
    <input type="number" class="quantity" value="1" min="1" style="width:50px">

    <!-- MÁY SCAN -->
    <select class="scanner">
      <option>SP3000</option>
      <option>HS1800</option>
      <option>Noritsu</option>
    </select>

    <!-- THỜI GIAN TRẢ FILE -->
    <select class="deadline">
      <option value="24h">24h</option>
      <option value="48h">48h</option>
      <option value="72h">72h</option>
      <option value="7d">7 ngày</option>
      <option value="14d">14 ngày</option>
    </select>

    

    <!-- OPTION CHECKBOX -->
    <div class="options">
      <label><input type="checkbox" class="store"> Lưu Film</label>
      <label><input type="checkbox" class="border"> Có Viền</label>
      <label><input type="checkbox" class="borderless"> Không Viền</label>
      <label><input type="checkbox" class="bigsize"> Bigsize</label>
      <label><input type="checkbox" class="raw"> scan RAW</label>
      <label><input type="checkbox" class="cut"> Cắt sleve</label>
    </div>

    <!-- NÚT XÓA -->
    <button class="remove" onclick="this.parentElement.remove()" style="color:red; cursor:pointer">✖</button>
  `;

  const filmSelect = row.querySelector(".film");
  const deadlineSelect = row.querySelector(".deadline");

  // set mặc định deadline theo film
  deadlineSelect.value = defaultDeadline[filmSelect.value] || "24h";

  filmSelect.addEventListener("change", () => {
    deadlineSelect.value = defaultDeadline[filmSelect.value] || "72h";
  });

  servicesDiv.appendChild(row);
}

// Gọi 1 lần để có dòng đầu tiên
addService();


// HÀM XỬ LÝ GỬI VÀ IN
function submitForm() {
  // 1. Lấy thông tin khách
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value; // Lấy email
  const phone = document.getElementById('phone').value;
  const dateNow = new Date().toLocaleString('vi-VN');
  const totalAmount = document.getElementById('total_amount').value; 


  // --- KIỂM TRA DỮ LIỆU ---
  if (!name || !phone) {
    alert("Vui lòng nhập Tên và Số điện thoại!");
    return;
  }
  
  if (!email || email.trim() === "") {
    alert("Vui lòng nhập Email khách hàng (bắt buộc để tạo QR và gửi mail)!");
    return;
  }

  // 2. Thu thập dữ liệu gửi Server (vẫn cần đủ thông tin để gửi mail báo cáo)
  const rows = document.querySelectorAll('.service-row');
  const payload = {
    name: name,
    email: email,
    phone: phone,
    total_amount: totalAmount
  };

  rows.forEach((row, i) => {
    const idx = i === 0 ? "" : i;
    // Lấy value
    const rcode = row.querySelector('.rcode').value || "";
    const film = row.querySelector('.film').value;
    const qty = row.querySelector('.quantity').value;
    const scanner = row.querySelector('.scanner').value;
    const deadline = row.querySelector('.deadline').value;
    // Checkbox
    const isBorder = row.querySelector('.border').checked;
    const isBig = row.querySelector('.bigsize').checked;
    const isRaw = row.querySelector('.raw').checked;
    const isCut = row.querySelector('.cut').checked;
    const isStore = row.querySelector('.store').checked;

    // Đưa vào payload
    payload["rcode" + idx] = rcode;
    payload["process" + idx] = film;
    payload["quantity" + idx] = qty;
    payload["scanner" + idx] = scanner;
    payload["deadline" + idx] = deadline;
    payload["options" + idx] = {
      border: isBorder, bigsize: isBig, raw: isRaw, cut: isCut, store: isStore
    };
  });

  // 3. Hiển thị dữ liệu lên vùng in (printArea)
  // Theo yêu cầu: Chỉ in Ngày, Tên, SĐT, Email, QR Code
  document.getElementById('p_name').innerText = name;
  document.getElementById('p_phone').innerText = phone;
  document.getElementById('p_email').innerText = email;
  document.getElementById('printDate').innerText = dateNow;
  
  // Xóa nội dung danh sách film trong vùng in (nếu bạn không muốn in chi tiết đơn hàng)
  document.getElementById('p_services_list').innerHTML = ""; 

  // 4. Tạo QR Code (CHỈ CHỨA EMAIL)
  const qrDiv = document.getElementById("qrcode");
  qrDiv.innerHTML = ""; // Xóa QR cũ
  
  new QRCode(qrDiv, {
    text: email,    // Chỉ lấy email làm nội dung QR
    width: 150,     // Kích thước QR
    height: 150
  });

  // 5. Gửi dữ liệu tới Server & Xử lý Alert
  fetch("/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Thành công -> Hiện Alert
      alert("Gửi mail thành công!");
      
      // Sau khi bấm OK -> Mới hiện cửa sổ In
      setTimeout(() => window.print(), 300);
    } else {
      alert("Lỗi gửi email: " + (data.message || "Unknown error"));
      // Tùy chọn: Có cho in khi lỗi không? Nếu có thì bỏ comment dòng dưới
      // setTimeout(() => window.print(), 300);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Không kết nối được Server gửi mail!");
  });
}