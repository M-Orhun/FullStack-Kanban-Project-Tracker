import React, { useState, useEffect } from 'react';
import axios from 'axios';
// CSS import'u dosya adı ile eşleşmeli
import './TaskDetailModal.css'; 

// Task tipini import etmek daha temiz olurdu ama şimdilik kopyalayalım
interface ITask {
  _id: string;
  title: string;
  description: string;
  dueDate: string | null; // Deadline eklendi
  status: 'To Do' | 'In Progress' | 'Done';
}

interface ModalProps {
  task: ITask | null;
  onClose: () => void;
  onTaskUpdate: (updatedTask: ITask) => void; 
}

const API_URL = 'http://localhost:5000/api/tasks';

const TaskDetailModal: React.FC<ModalProps> = ({ task, onClose, onTaskUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedDueDate, setEditedDueDate] = useState<string>(''); 

  // Modal açıldığında veya task değiştiğinde, düzenleme alanlarını doldur ve modu sıfırla
  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description || ''); 
      setIsEditing(false); // ÖNEMLİ: Her açılışta GÖRÜNTÜLEME moduna dön
      
      // dueDate'i ayarla (ISO'dan YYYY-MM-DD formatına dönüştür)
      if (task.dueDate) {
        setEditedDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
      } else {
        setEditedDueDate(''); // Yoksa boş bırak
      }
    }
  }, [task]); 

  // Eğer gösterilecek bir task yoksa, modalı render etme
  if (!task) {
    return null;
  }

  // --- Fonksiyonlar ---
  const handleEdit = () => {
    setIsEditing(true); // Düzenleme moduna geç
  };

  const handleCancel = () => {
    // Değişiklikleri iptal et, orijinal değerleri geri yükle
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    if (task.dueDate) {
        setEditedDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
    } else {
        setEditedDueDate('');
    }
    setIsEditing(false); // Görüntüleme moduna dön
  };
  
  // YENİ FONKSİYON: Tarih değişimini kontrol et (Geçmiş tarih engeli)
  const handleDateChange = (dateString: string) => {
      const selectedDate = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      if (selectedDate < today) {
          alert("Bitiş tarihi geçmiş bir tarih olamaz. Lütfen bugünün veya ileriki bir tarihi seçiniz.");
          setEditedDueDate(new Date().toISOString().split('T')[0]); // Bugüne sıfırla
          return;
      }

      setEditedDueDate(dateString); 
  };


  const handleSave = async () => {
    if (!editedTitle.trim()) {
      alert("Başlık boş olamaz!");
      return;
    }

    const updatedData = {
      title: editedTitle,
      description: editedDescription,
      dueDate: editedDueDate || null, // Boşsa null gönder
    };

    try {
      const response = await axios.put(`${API_URL}/${task._id}`, updatedData);
      const updatedTaskFromServer = response.data;

      // Ana uygulamadaki state'i güncelle (App.tsx'e haber ver)
      onTaskUpdate(updatedTaskFromServer); 

      setIsEditing(false); // Modu sıfırla
      onClose(); // Kaydettikten sonra modalı kapat

    } catch (error) {
      console.error("Görev güncellenirken bir hata oluştu:", error);
      alert("Görev güncellenirken bir hata oluştu.");
    }
  };

  // --- GÜNCELLENMİŞ RENDER KISMI ---
  return (
    <div className="modal-overlay" onClick={handleCancel}> 
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {isEditing ? (
          // --- Düzenleme Modu ---
          <>
            <input 
              type="text" 
              value={editedTitle} 
              onChange={(e) => setEditedTitle(e.target.value)} 
              className="modal-input title-input"
            />
            <textarea 
              value={editedDescription} 
              onChange={(e) => setEditedDescription(e.target.value)} 
              className="modal-input description-textarea" 
              placeholder="Açıklama ekle..."
            />
            {/* YENİ: Tarih Seçici */}
            <div className="modal-date-picker">
                <label htmlFor="dueDate">Due Date:</label>
                <input
                  id="dueDate"
                  type="date"
                  value={editedDueDate}
                  onChange={(e) => handleDateChange(e.target.value)} // Kendi fonksiyonumuzu çağırdık
                  className="modal-input date-input"
                  min={new Date().toISOString().split('T')[0]} // HTML kontrolü
                />
            </div>

            <p><strong>Status:</strong> {task.status}</p> 
            <div className="modal-buttons">
              <button className="save-button" onClick={handleSave}>Save</button>
              <button className="cancel-button" onClick={handleCancel}>Cancel</button>
            </div>
          </>
        ) : (
          // --- Görüntüleme Modu ---
          <>
            <h2>{task.title}</h2>
            <p>{task.description || "No description provided."}</p>
            {/* YENİ: Görüntüleme modunda dueDate'i göster */}
            {task.dueDate && (
              <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            )}
            <p><strong>Status:</strong> {task.status}</p>
            <div className="modal-buttons">
              <button className="edit-button" onClick={handleEdit}>Edit</button>
              <button className="close-button" onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetailModal;