const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Sửa tên biến từ mogoose thành mongoose
const userRouter = require('./user');
const fileRoutes = require ('./fileapi');
const filecreate = require('./filecreate');

const app = express();
app.use(cors());
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/my_mongodb', {
  useNewUrlParser: true,  // Sử dụng URL parser mới
  useUnifiedTopology: true // Sử dụng topology engine mới
});

app.use(express.json());

app.use(filecreate);
app.use(userRouter);
app.use(fileRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Thông báo khi kết nối thành công
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Thông báo nếu có lỗi xảy ra khi kết nối
mongoose.connection.on('error', (err) => {
  console.error('Failed to connect to MongoDB', err);
});

// Thông báo khi kết nối bị đóng
mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});