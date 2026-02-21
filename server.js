

// const express = require("express");
// const nodemailer = require("nodemailer");
// const cors = require("cors");
// const QRCode = require("qrcode"); // thư viện QRCode cho Node.js

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post("/send-email", async (req, res) => {
//   const {
//   name, email, rcode,rcode1,rcode2,rcode3,
//   process, process1, process2, process3,
//   quantity, quantity1, quantity2, quantity3,
//   scanner, scanner1, scanner2, scanner3,
//   deadline, deadline1, deadline2, deadline3,
//   options, options1, options2, options3,total_amount
// } = req.body;


// const items = [
//   { rcode, process, quantity,scanner, options, deadline },
//   { rcode: rcode1, process: process1, quantity: quantity1, scanner: scanner1, options: options1, deadline: deadline1 },
//   { rcode: rcode2, process: process2, quantity: quantity2, scanner: scanner2, options: options2, deadline: deadline2 },
//   { rcode: rcode3, process: process3, quantity: quantity3, scanner: scanner3, options: options3, deadline: deadline3 },
// ].filter(i => i.rcode); // chỉ lấy dòng có mã hóa đơn


// function renderOptions(opt = {}) {
//   const map = {
//     border: "Có Viền",
//     borderless: "Không Viền",
//     bigsize: "Bigsize",
//     raw: "RAW",
//     cut: "Cắt Sleve",
//     store: "Lưu trữ âm bản"
//   };
//   return Object.keys(map)
//     .filter(k => opt[k])
//     .map(k => map[k])
//     .join(", ");
// }


//   try {
//     // tạo QR code dạng DataURL
//     const qrDataUrl = await QRCode.toDataURL(rcode);

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "hongrdragon@gmail.com",  // Gmail của bạn
//         pass: "sfemutbldvuhtbip"       // App password Gmail
//       }
//     });

//     let htmlContent = `
// <div style="font-family:Arial;padding:30px;color:#333">
//   <h2>Film của khách hàng đã được tiếp nhận </h2>

//   <h3>📋 Chi tiết hóa đơn của khách hàng</h3>

//   <style>
//   /* Desktop / mặc định */
//   .rtable{
//     border-collapse:collapse;
//     width:100%;
//     font-size:25px;
//     font-weight:bold;
//   }
//   .rtable th,.rtable td{
//     border:1px solid #ccc;
//     padding:6px;
//   }
//   .rtable thead tr{ background:#f0f0f0; }
//   .text-center{ text-align:center; }

//   /* Mobile */
//   @media (max-width: 768px){
//     .rtable{ font-size:20px; font-weight:bold; }                 /* chữ nhỏ lại cho vừa màn */
//     .rtable thead{ display:none; }              /* ẩn header */

//     .rtable, .rtable tbody, .rtable tr, .rtable td{
//       display:block;
//       width:100%;
//     }

//     .rtable tr{
//       margin:12px 0;
//       border:1px solid #978282;
//       border-radius:10px;
//       overflow:hidden;
//       background:#fff;
//     }

//     .rtable td{
//       border:none;
//       border-bottom:1px solid #eee;
//       padding:10px 12px;
//       text-align:left !important;
//     }
//     .rtable td:last-child{ border-bottom:none; }

//     /* Nhãn cho từng ô */
//     .rtable td::before{
//       content: attr(data-label);
//       display:block;
//       font-size:18px;
//       font-weight:bold;
//       opacity:.7;
//       margin-bottom:4px;
//     }
//   }
// </style>

// <table class="rtable">
//   <thead>
//     <tr>
//       <th>STT</th>
//       <th>Mã Hóa Đơn</th>
//       <th>Loại film</th>
//       <th>Số lượng</th>
//       <th>Option scan</th>
//       <th>Thời gian trả file</th>
//     </tr>
//   </thead>
//   <tbody>
//     ${items.map((it, i) => `
//       <tr>
//         <td class="text-center" data-label="STT">${i + 1}</td>
//         <td data-label="Mã Hóa Đơn">${it.rcode}</td>
//         <td data-label="Loại film">${it.process}</td>
//         <td class="text-center" data-label="Số lượng">${it.quantity}</td>
//         <td data-label="Option scan">${renderOptions(it.options)}</td>
//         <td data-label="Thời gian trả file">${it.deadline}</td>
//       </tr>
//     `).join("")}
//   </tbody>
// </table> `;

//  if (total_amount && Number(total_amount) > 0) {
//       // Format tiền Việt Nam: 100000 -> 100.000 ₫
//       const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total_amount);
//       htmlContent += `
//         <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 5px;">
//           <h3 style="color: #856404; margin-top: 0;">💰 THÔNG TIN THANH TOÁN</h3>
//           <p style="font-size: 18px;">Tổng cộng: <strong style="color: #dc3545; font-size: 22px;">${formattedPrice}</strong></p>
          
//           <p>Vui lòng chuyển khoản theo thông tin dưới đây:</p>
//           <ul style="list-style: none; padding-left: 0;">
//             <li>🏦 Ngân hàng: <b>VIETCOMBANK (VCB)</b></li>
//             <li>💳 Số tài khoản: <b>9999.8888.6666</b></li>
//             <li>👤 Chủ tài khoản: <b>NGUYEN VAN A</b></li>
//             <li>📝 Nội dung CK: <b>${name} - ${req.body.phone}</b></li>
//           </ul>
          
//           <!-- (Tùy chọn) Chèn ảnh QR Ngân hàng nếu có -->
//           <!-- <img src="URL_ANH_QR_CUA_BAN" alt="QR Code Bank" style="width: 150px; margin-top: 10px;"> -->
//         </div>
//       `;
//     }
// htmlContent += `
//               <p style="margin-top:16px;font-size:20px">
//               <p style="margin-top:16px;font-size:20px;font-weight:bold"> * Thời gian lưu film: </p>
//               <p style="margin-top:16px;font-size:16px">
//             Lab tiến hành lưu trữ âm bản của các bạn trong thời gian tối đa 6 tháng đối với các film được gửi trực tiếp ở Đà Lạt .
//             Đối với các film gửi từ tỉnh, lab sẽ lưu trữ âm bản trong 6 tháng hoặc ship âm bản về ( khách hàng chịu phí ship).</p>
//             <p style="margin-top:16px;font-size:20px;font-weight:bold">* Thời gian lưu file ảnh trên hệ thống ( offline và online ): </p>
//             <p style="margin-top:16px;font-size:16px">
//             Lab sẽ tiến hành lưu trữ file ảnh trên hệ thống drive (online) trong 6 tháng kể từ ngày gửi film.
//             Ngoài ra, Lab vẫn sẽ lưu trữ file ảnh offline cho các bạn ở hệ thống máy chủ trong vòng 3 tháng kể từ ngày gửi film.</p>

//             <p style="margin-top:16px;font-size:20px;font-weight:bold">* Mọi thắc mắc về việc tráng, scan film: </p>
//             <p style="margin-top:16px;font-size:16px">
//             Xin vui lòng liên hệ trực tiếp 0837.377.977 hoặc fanpage Cinephile FilmLab Đà Lạt để được bọn mình giải đáp nhanh nhất nhé ☺</p>

//             <p style="margin-top:16px;font-size:20px;font-weight:bold">
//             * Trong trường hợp không nhận đc email của Lab</p>
//             <br>
//             1. Vào gmail, search: " cinephile.filmlab@gmail.com " hoặc vào mục Spam (Hộp thư rác) để kiểm tra. ❤
//             <br>
//             2. Vào GG Drive, trong mục " Được chia sẻ với tôi" sẽ có Folder trùng tên với mã biên nhận của bạn. ❤
//             <br>
//             3. Gọi điện thoại cho lab hoặc nhắn tin qua Fanpage Cinephile Filmlab Đà Lạt > cung cấp mã biên nhận, để được hỗ trợ nhanh nhất bạn nha. ❤
//             Chúc các bạn một ngày mới tốt lành, nhiều ảnh đẹp.

//             - Cinephile FilmLab Team -
//             ----------------------------------------------------
//             <p style="margin-top:16px;font-size:20px">Mọi chi tiết xin liên hệ :</p>
//             <p style="margin-top:16px;font-size:16px">
//             🏠 Địa chỉ : 2 Hà Huy Tập, P.3, Đà Lạt
//             <br>
//             (https://maps.app.goo.gl/aLejDwJGWa6ZEVweA?g_st=ic)
//             <br>

//             📷 IG : @cinephile.filmlab
//             (https://www.instagram.com/cinephile.filmlab)
//             <br>

//             ☎️ : 0837.377.977
//             <br>

//             ⏱ : 8h - 20h
//             <br>

//             ✉️ : cinephile.filmlab@gmail.com
//             </p>
//               </p>

//               <p>📞 Hotline: 0837.377.977</p>
//             </div>
// `;


//     await transporter.sendMail({
//       from: "hongrdragon@gmail.com",
//       to: email,
//       subject: ` Cinephile FilmLab Thông Báo Tiếp Nhận Film, Xin chào ${name}`,
//       html: htmlContent
//     });

//     res.json({ success: true });

//   } catch (err) {
//     console.error("Lỗi gửi mail:", err);
//     res.json({ success: false, error: err });
//   }
// });

// app.listen(3000, () => console.log("Server chạy tại http://localhost:3000"));












const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const QRCode = require("qrcode");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-email", async (req, res) => {
  const {
    name, email,
    rcode, rcode1, rcode2, rcode3,
    process, process1, process2, process3,
    quantity, quantity1, quantity2, quantity3,
    scanner, scanner1, scanner2, scanner3,
    deadline, deadline1, deadline2, deadline3,
    options, options1, options2, options3,
    total_amount
  } = req.body;

  // Lọc dữ liệu
  const items = [
    { rcode, process, quantity, scanner, options, deadline },
    { rcode: rcode1, process: process1, quantity: quantity1, scanner: scanner1, options: options1, deadline: deadline1 },
    { rcode: rcode2, process: process2, quantity: quantity2, scanner: scanner2, options: options2, deadline: deadline2 },
    { rcode: rcode3, process: process3, quantity: quantity3, scanner: scanner3, options: options3, deadline: deadline3 },
  ].filter(i => i.rcode);

  function renderOptions(opt = {}) {
    const map = {
      border: "Có Viền",
      borderless: "Không Viền",
      bigsize: "Bigsize",
      raw: "RAW",
      cut: "Cắt Sleve",
      store: "Lưu Film"
    };
    if (!opt) return "";
    return Object.keys(map).filter(k => opt[k]).map(k => map[k]).join(", ");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "hongrdragon@gmail.com",
        pass: "sfemutbldvuhtbip"
      }
    });

    // --- BẮT ĐẦU NỘI DUNG EMAIL TỐI ƯU MOBILE ---
    let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        /* CSS CHUNG CHO CẢ PC VÀ MOBILE */
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 650px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #978282; padding-bottom: 10px; margin-bottom: 20px; }
        .footer { font-size: 14px; color: #666; margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 20px; }
        
        /* CSS CHO BẢNG (Mặc định Desktop) */
        .rtable {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .rtable th, .rtable td {
          border: 1px solid #000; /* Viền đen theo yêu cầu */
          padding: 10px;
          text-align: center;     /* Căn giữa theo yêu cầu */
          font-size: 16px;        /* Font vừa phải */
          font-weight: bold;      /* Chữ đậm theo yêu cầu */
        }
        .rtable thead {
          background-color: #978282; /* Màu nền header */
          color: #fff;
        }

        /* CSS THANH TOÁN */
        .payment-box {
          background-color: #fff8e1;
          border: 2px dashed #ffb300;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }

        /* --- QUAN TRỌNG: RESPONSIVE MOBILE --- */
        @media only screen and (max-width: 600px) {
          .container { padding: 10px; width: 100% !important; }
          
          /* Biến bảng thành dạng thẻ (Card view) */
          .rtable, .rtable tbody, .rtable tr, .rtable td {
            display: block;
            width: 100%;
            box-sizing: border-box;
          }
          
          /* Ẩn tiêu đề bảng đi */
          .rtable thead { display: none; }
          
          /* Mỗi dòng dữ liệu thành 1 khối hộp */
          .rtable tr {
            margin-bottom: 15px;
            border: 2px solid #978282; /* Viền màu chủ đạo */
            border-radius: 10px;
            background-color: #fafafa;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          
          /* Định dạng từng ô dữ liệu bên trong thẻ */
          .rtable td {
            text-align: right;
            padding-left: 50%;
            position: relative;
            border: none;
            border-bottom: 1px solid #ddd;
            font-size: 15px;
          }
          
          .rtable td:last-child { border-bottom: none; }
          
          /* Tạo nhãn giả (Label) bên trái */
          .rtable td::before {
            content: attr(data-label);
            position: absolute;
            left: 10px;
            width: 40%;
            padding-right: 10px;
            white-space: nowrap;
            text-align: left;
            font-weight: bold;
            color: #978282;
            text-transform: uppercase;
            font-size: 13px;
          }

          /* Tăng kích thước chữ cho dễ đọc trên mobile */
          h2 { font-size: 22px; }
          h3 { font-size: 18px; }
          .payment-box p, .payment-box li { font-size: 16px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📷 CINEPHILE FILM LAB</h2>
          <p>Thông báo tiếp nhận film - Xin chào <b>${name}</b></p>
        </div>

        <h3>📋 Chi tiết đơn hàng:</h3>
        
        <table class="rtable">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã HĐ</th>
              <th>Loại Film</th>
              <th>SL</th>
              <th>Options</th>
              <th>Trả File</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((it, i) => `
              <tr>
                <td data-label="STT">${i + 1}</td>
                <td data-label="Mã HĐ" style="color:#d32f2f;">${it.rcode}</td>
                <td data-label="Loại Film">${it.process}</td>
                <td data-label="Số Lượng">${it.quantity}</td>
                <td data-label="Options">${renderOptions(it.options)}</td>
                <td data-label="Trả File" style="color:#2e7d32;">${it.deadline}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
    `;

    // --- PHẦN THANH TOÁN ---
    if (total_amount && Number(total_amount) > 0) {
      const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total_amount);
      htmlContent += `
        <div class="payment-box">
          <h3 style="margin-top:0; color:#e65100; text-align:center; border-bottom:1px solid #ffcc80; padding-bottom:10px;">
            💰 THÔNG TIN THANH TOÁN
          </h3>
          <p style="font-size:18px; text-align:center;">
            Tổng cộng: <strong style="color:#d32f2f; font-size:24px;">${formattedPrice}</strong>
          </p>
          <div style="background:#fff; padding:10px; border-radius:5px;">
            <p><b>🏦 Ngân hàng:</b> VIETCOMBANK (VCB)</p>
            <p><b>💳 Số TK:</b> 9999.8888.6666</p>
            <p><b>👤 Chủ TK:</b> NGUYEN VAN A</p>
            <p><b>📝 Nội dung:</b> ${name} - ${req.body.phone}</p>
          </div>
        </div>
      `;
    }

    // --- PHẦN FOOTER ---
    htmlContent += `
        <div class="footer">
          <p><b>⚠️ LƯU Ý QUAN TRỌNG:</b></p>
          <ul style="padding-left: 20px;">
            <li><b>Lưu Film:</b> Tối đa 6 tháng (tại Lab) hoặc gửi trả (khách chịu ship).</li>
            <li><b>Lưu File Ảnh:</b> Online (6 tháng) - Offline (3 tháng).</li>
            <li><b>Hỗ Trợ:</b> Nếu không nhận được mail, vui lòng kiểm tra mục Spam hoặc liên hệ Hotline.</li>
          </ul>
          
          <div style="text-align:center; margin-top:20px; background:#f5f5f5; padding:15px; border-radius:10px;">
            <p style="margin:5px 0; font-weight:bold; color:#978282;">CINEPHILE FILM LAB ĐÀ LẠT</p>
            <p style="margin:5px 0;">🏠 2 Hà Huy Tập, P.3, Đà Lạt</p>
            <p style="margin:5px 0;">☎️ Hotline: <a href="tel:0837377977" style="color:#d32f2f; text-decoration:none; font-weight:bold;">0837.377.977</a></p>
            <p style="margin:5px 0;">✉️ Email: cinephile.filmlab@gmail.com</p>
            <p style="margin:5px 0;">📷 IG: @cinephile.filmlab</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: "hongrdragon@gmail.com",
      to: email,
      subject: `[Cinephile] Tiếp nhận đơn hàng - ${name}`,
      html: htmlContent
    });

    res.json({ success: true });

  } catch (err) {
    console.error("Lỗi gửi mail:", err);
    res.json({ success: false, error: err.toString() });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));






















