import React from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';

// Prop tanımları
interface TaskCardProps {
  task: any; // ITask tipini App.tsx'ten alır
  index: number;
  openModal: (task: any) => void;
  handleDeleteTask: (taskId: string) => void;
  colorStyle: any; // Dinamik renk stili
}

// TaskCard bileşenini React.memo ile sarmalayarak performansı artırıyoruz
const TaskCard = React.memo((props: TaskCardProps) => {
  const { task, index, openModal, handleDeleteTask, colorStyle } = props;

  return (
    <Draggable key={task._id} draggableId={task._id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
          style={colorStyle ? { backgroundColor: colorStyle, ...provided.draggableProps.style } : provided.draggableProps.style}
        >
          {/* Kart İçeriği - BURASI TIKLAMA ALANI */}
          <div 
              className="task-card-content"
              onClick={() => openModal(task)} 
          > 
            {/* BAŞLIK: SÜRÜKLEME TUTAMACI BURADA */}
            <span 
              className="task-title"
              {...provided.dragHandleProps} 
            >
              {task.title}
            </span>
            {task.dueDate && (
              <div className="task-due-date">
                🗓️ {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
          {/* Silme Butonu */}
          <button
            className="delete-button"
            onClick={(e) => { e.stopPropagation(); handleDeleteTask(task._id); }}
          >
            X
          </button>
        </div>
      )}
    </Draggable>
  );
});

export default TaskCard;