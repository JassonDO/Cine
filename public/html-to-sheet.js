const SHEET_API_URL = "https://script.google.com/macros/s/AKfycby-_2dYff0zskH6wKyiJD1F9qSaHPwkjcVoq_TAnhrniGrAbyx1eUo_CPPmZLgNR5bU/exec";

function searchCustomer() {
  const phone = document.getElementById("phone").value;
  const loading = document.getElementById("loading");

  if (!phone) return;

  loading.style.display = "inline"; // Hiện chữ đang tìm

  // Gọi API Google Script
  fetch(`${SHEET_API_URL}?phone=${phone}`)
    .then(response => response.json())
    .then(data => {
      loading.style.display = "none"; // Ẩn chữ đang tìm
      
      if (data.result === "success") {
        // Tự động điền dữ liệu tìm thấy vào ô input
        document.getElementById("name").value = data.name;
        document.getElementById("email").value = data.email;
        alert("Đã tìm thấy thông tin khách hàng cũ!");
      } else if (data.result === "not_found") {
        console.log("Khách hàng mới (chưa có trong sheet)");
      }
    })
    .catch(error => {
      loading.style.display = "none";
      console.error("Lỗi kết nối Sheet:", error);
    });
}


function addCustomer() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const loading = document.getElementById("loading");

  // Kiểm tra dữ liệu
  if (!phone || !name) {
    alert("Vui lòng nhập đầy đủ Tên và Số điện thoại!");
    return;
  }
  const formattedPhone = "'" + phone; // Thêm dấu ' để giữ nguyên định dạng số khi lưu vào Google Sheet

  if(loading) loading.style.display = "inline";
  if(loading) loading.innerText = "Đang lưu...";

  // Tạo dữ liệu gửi đi
  const dataPost = {
    action: "add", // Báo cho server biết đây là hành động Thêm
    name: name,
    email: email,
    phone: formattedPhone
  };

  // Gửi POST request
  fetch(SHEET_API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // Quan trọng để tránh lỗi CORS
    body: JSON.stringify(dataPost)
  })
  .then(response => response.json())
  .then(data => {
    if(loading) loading.style.display = "none";
    
    // Kiểm tra kết quả trả về (status hoặc result tùy script server của bạn)
    if (data.status === "success" || data.result === "success") {
      alert("✅ Thêm khách hàng thành công!");
    } else {
      alert("⚠️ Lỗi: " + (data.message || "Không thể thêm dòng mới"));
    }
  })
  .catch(error => {
    if(loading) loading.style.display = "none";
    console.error("Lỗi:", error);
    alert("❌ Lỗi kết nối Google Sheet!");
  });
}