import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import './App.css';
import TaskDetailModal from './Components/TaskDetailModal'; // BÜYÜK C'ye dikkat!
import TaskCard from './Components/TaskCard';

// Sütun tipleri
type TaskStatus = 'To Do' | 'In Progress' | 'Done';

// Görev arayüzü (Deadline dahil)
interface ITask {
  _id: string;
  title: string;
  description: string;
  dueDate: string | null; 
  status: TaskStatus;
}

const API_URL = 'http://localhost:5000/api/tasks';

// --- YARDIMCI FONKSİYON: Deadline'a göre dinamik HSL rengini hesapla ---
const getDeadlineColor = (task: ITask): string | null => {
  // 1. Durum: Eğer task 'Done' ise, her zaman sabit yeşil tonunu döndür
  if (task.status === 'Done') {
    return 'hsl(120, 60%, 40%)'; 
  }

  // 2. Durum: Eğer dueDate yoksa veya 10 günden fazla kaldıysa, varsayılan (null) döndür
  if (!task.dueDate) {
    return null; 
  }
  
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((dueDate.getTime() - today.getTime()) / oneDay);

  const maxTransitionDays = 10; 

  if (diffDays <= 0) {
    // Tarih geçtiyse (0 veya eksi), tam kırmızı (Hue 0)
    return `hsl(0, 70%, 50%)`; 
  } 
  
  if (diffDays > maxTransitionDays) {
    return null; 
  }
  
  // Dinamik renk hesaplama: 10 gün (sarımsı) ile 0 gün (kırmızı) arası
  const minHue = 0;   
  const maxHue = 60;  
  const normalizedDays = diffDays / maxTransitionDays; 
  const hue = minHue + (maxHue * normalizedDays);

  return `hsl(${hue}, 70%, 50%)`;
};

function App() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 1. Veri Çekme ---
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data);
      } catch (error) {
        console.error("Görevler çekilemedi:", error);
      }
    };
    fetchTasks();
  }, []);

  // --- 2. Sürükle Bırak Fonksiyonu (Düzeltilmiş) ---
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
        return;
    }

    const newStatus = destination.droppableId as TaskStatus;

    // Optimistic UI: Arayüzü hemen güncelle
    setTasks(prevTasks =>
        prevTasks.map(task =>
            task._id === draggableId
                ? { ...task, status: newStatus }
                : task
        )
    );

    // Backend'i güncelle (Arka planda)
    axios.put(`${API_URL}/${draggableId}`, {
        status: newStatus
    }).catch(error => {
        console.error("Görev güncellenemedi (arka planda):", error);
    });
  };

  // --- 3. Yeni Görev Ekleme ---
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post(API_URL, {
        title: newTaskTitle,
        status: 'To Do',
        description: '',
        dueDate: null,
      });
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Görev eklenemedi:", error);
    }
  };

  // --- 4. Görev Silme ('X' Butonu) ---
  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`); 
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId)); 
    } catch (error) {
      console.error("Error", error);
    }
  };

  // --- 5. Modal Kontrolleri ---
  const openModal = (task: ITask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // --- 6. Modal'dan Gelen Güncellemeyi İşleme ---
  const handleTaskUpdateFromModal = (updatedTask: ITask) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  // --- 7. Arayüz (Render) ---
  const columns: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app-container">
        <h1 className="app-title">Simple Project Tracker</h1>

        {/* Yeni Görev Ekleme Formu */}
        <form onSubmit={handleAddTask} className="add-task-form">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
          />
          <button type="submit">Add</button>
        </form>

        {/* Kanban Sütunları */}
        <div className="kanban-board">
          {columns.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`kanban-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                >
                  <h2>{status}</h2>
                  {tasks  
                    .filter(task => task.status === status)
                    .map((task, index) => {
                    const colorStyle = getDeadlineColor(task);

    return (
                    <TaskCard 
                        key={task._id} 
                        task={task} 
                        index={index} 
                        openModal={openModal} 
                        handleDeleteTask={handleDeleteTask} 
                        colorStyle={colorStyle} 
                    />
                  );
                })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </div>
      </div>

      {/* Modal Component'i */}
      <TaskDetailModal
          task={selectedTask}
          onClose={closeModal}
          onTaskUpdate={handleTaskUpdateFromModal}
      />

    </DragDropContext>
  );
}

export default App;