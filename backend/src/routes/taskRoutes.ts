import express, { Request, Response } from 'express';
import Task from '../models/Task'; // Az önce oluşturduğumuz Task modelini içe aktar

const router = express.Router();

// --- 1. TÜM GÖREVLERİ GETİR (GET) ---
router.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find(); // Veritabanındaki tüm Task'ları bul
    res.status(200).json(tasks); // Bulunanları JSON olarak gönder
  } catch (error) {
    res.status(500).json({ message: 'Görevler getirilemedi', error });
  }
});

// --- 2. YENİ GÖREV OLUŞTUR (POST) ---
router.post('/', async (req: Request, res: Response) => {
  // Yeni görevin başlığını ve açıklamasını request'in gövdesinden (body) al
  const { title, description, status } = req.body;

  const newTask = new Task({
    title,
    description,
    status,
  });

  try {
    const savedTask = await newTask.save(); // Veritabanına kaydet
    res.status(201).json(savedTask); // Kaydedilen görevi geri gönder
  } catch (error) {
    res.status(400).json({ message: 'Görev oluşturulamadı', error });
  }
});

// --- 3. GÖREVİ GÜNCELLE (PUT) ---
// (Özellikle Sürükle-Bırak için kartın status'ünü güncellemek için)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, // URL'den gelen ID'yi al (örn: /api/tasks/12345)
      req.body, // Güncellenecek yeni veriyi al (örn: { status: 'In Progress' })
      { new: true } // Güncellenmiş veriyi geri döndür
    );
    if (!updatedTask) return res.status(404).json({ message: 'Görev bulunamadı' });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Görev güncellenemedi', error });
  }
});

// --- 4. GÖREVİ SİL (DELETE) ---
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: 'Görev bulunamadı' });
    res.status(200).json({ message: 'Görev başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Görev silinemedi', error });
  }
});

export default router;