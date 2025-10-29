import mongoose, { Document, Schema } from 'mongoose';

// TypeScript Arayüzü
export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date | null; // YENİ: Deadline alanı (Date tipi)
  status: 'To Do' | 'In Progress' | 'Done';
}

// Veritabanı Şeması
const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: Date, default: null }, // YENİ: Deadline alanı
  status: { 
    type: String, 
    enum: ['To Do', 'In Progress', 'Done'], 
    default: 'To Do' 
  },
});

// Modeli oluştur ve dışa aktar
export default mongoose.model<ITask>('Task', TaskSchema);