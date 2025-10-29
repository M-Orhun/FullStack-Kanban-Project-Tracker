import express from 'express';
import mongoose from 'mongoose';
import taskRoutes from './routes/taskRoutes'; // YENİ EKLENDİ

// Uygulamayı başlat
const app = express();
app.use(express.json()); // JSON gövdelerini okumak için

// CORS ayarları (Frontend'in Backend'e bağlanabilmesi için)
app.use((req, res, next) => {
  // Frontend'in adresi (localhost:3000) için izin ver
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Görev Rotaları
app.use('/api/tasks', taskRoutes); // YENİ EKLENDİ

// --- MongoDB bağlantısı ---
// Kopyaladığın bağlantı dizesini BURAYA yapıştır
// !! Kendi bağlantı dizenle bu satırı DEĞİŞTİR !!
const MONGO_URI = "mongodb+srv://kanbanUser:kanbanPass123@clusterorhun.2spa7os.mongodb.net/kanbanDB?appName=clusterorhun";

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB baglantisi basarili.'))
  .catch(err => console.error('MongoDB baglanti hatasi:', err));


// Sunucuyu başlat
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server http://localhost:${PORT} adresinde calisiyor.`));