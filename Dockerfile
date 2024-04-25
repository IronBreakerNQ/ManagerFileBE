# Sử dụng một image base chứa Node.js phiên bản 18.17.0
FROM node:18.17.0

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package*.json package-lock.jsondoc ./

# Cài đặt dependencies
RUN npm install

# Sao chép mã nguồn của ứng dụng vào container
COPY . .

# Mở cổng mặc định cho ứng dụng Node.js
EXPOSE 3000

# Khởi chạy ứng dụng
CMD ["node", "index.js"]
