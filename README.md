# 💸 Payment Bot Discord

Bot Discord giúp tạo mã thanh toán ngân hàng (hoặc ví) và tự động xác nhận giao dịch thông qua Google Sheets (qua SEPay). Bot hỗ trợ tạo mã QR thanh toán, kiểm tra giao dịch định kỳ và gán role cho người dùng khi thanh toán thành công.

## 🚀 Tính năng chính

- Slash command /taoct để tạo thông tin thanh toán.
- Hỗ trợ nhiều ngân hàng hoặc ví điện tử (cấu hình được).
- Tự động tạo mã QR với nội dung chuyển khoản ngẫu nhiên.
- Kiểm tra giao dịch từ Google Sheets theo thời gian thực (đồng bộ từ SEPay).
- Gửi log giao dịch đến kênh riêng biệt.
- Gán role khách hàng khi thanh toán thành công.
- Giao diện đẹp mắt với Discord Embeds.

## ⚙️ Cài đặt

### 1. Clone source code:
```sh
git clone https://github.com/ZenKho-chill/Payment-Bot-Discord.git
cd dst-payment-bot
```

### 2. Cài đặt dependencies:
```sh
npm install
```

### 3. Cấu hình biến môi trường:
Tạo file .env từ mẫu:
```sh
cp .env.example .env
```

Sau đó cập nhật các giá trị:
- BOT_TOKEN: Token bot Discord
- CLIENT_ID, GUILD_ID: ID bot & server
- ALLOWED_ROLE_ID, CUSTOMER_ROLE_ID: Role được quyền sử dụng bot và role khách hàng
- SHEET_ID, SHEET_RANGE: Google Sheet lưu log giao dịch
- SERVICE_ACCOUNT_FILE: Đường dẫn đến file JSON từ Google
- BANK_ACCOUNTS: JSON danh sách tài khoản ngân hàng

### 4. Cấu hình Google Service Account

1. Truy cập Google Cloud Console: https://console.cloud.google.com/  
2. Tạo project & bật Google Sheets API.  
3. Tạo Service Account và cấp quyền "Viewer".  
4. Tạo key JSON và lưu vào thư mục dự án.  
5. Chia sẻ Google Sheet cho email của service account (ví dụ: example@project.iam.gserviceaccount.com).

### 5. Cấu hình Google Sheet với SEPay:
- Truy cập: https://sepay.vn
- Thêm tài khoản ngân hàng và bật ghi Google Sheet
- Lấy SHEET_ID, SHEET_RANGE từ sheet
- Đảm bảo Google service account có quyền truy cập sheet đó

## 🧪 Khởi chạy bot

Chạy bằng Node.js:
```sh
node bot.js
```

Chạy bằng Docker:
```sh
docker build -t dst-payment-bot .
docker run -d --name payment-discord-bot payment-discord-bot
```

## 💬 Slash Command

Lệnh /taoct dùng để tạo mã QR thanh toán

Tham số:
- bank: ngân hàng/ví (ví dụ: mbbank, tpbank)
- amount: số tiền cần thanh toán (VND)

Chức năng:
- Tạo mã QR có nội dung chuyển khoản riêng
- Kiểm tra Google Sheet xác minh giao dịch
- Gán role khách hàng và log giao dịch thành công

## 📁 Cấu trúc thư mục

.  
├── bot.js =============== Logic chính của bot  
├── embeds.js ============ Hàm tạo Discord embeds  
├── .env.example ========== Mẫu biến môi trường  
├── Dockerfile ============ Docker cấu hình  
├── package.json  
└── README.md

## 🔐 Bảo mật

- Không upload .env hoặc file JSON credentials lên GitHub
- Giới hạn người dùng bằng ALLOWED_ROLE_ID

## 👤 Tác giả

- Zenkho
- Liên hệ: [ZenKho trong Discord](https://discord.com/users/917970047325077615)

## 📜 Giấy phép

Dự án này sử dụng giấy phép GNU GPL v3.
Bạn có thể sử dụng, chia sẻ, chỉnh sửa với điều kiện giữ nguyên giấy phép và ghi công tác giả.
Chi tiết: https://www.gnu.org/licenses/gpl-3.0.html
