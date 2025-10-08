import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "../components/kanban/KanbanColumn";
import { TaskCard } from "../components/kanban/TaskCard";


const initialTasks = [
  {
    id: 1,
    title: "Diseñar mockups",
    description: "Diseños para el dashboard",
    createdAt: new Date(),
    status: "todo",
  },
  {
    id: 2,
    title: "Implementar login",
    description: "Autenticación con JWT",
    createdAt: new Date(),
    status: "inProgress",
  },
  {
    id: 3,
    title: "Configurar DB",
    description: "Relaciones y seeds",
    createdAt: new Date(),
    status: "completed",
  },
];

export default function Index() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const columns = [
    { id: "todo", title: "Por hacer" },
    { id: "inProgress", title: "En progreso" },
    { id: "completed", title: "Completado" },
  ];

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);
    if (!activeTask) return;

    const activeStatus = activeTask.status;
    const overStatus = overTask?.status || overId;

    if (activeStatus === overStatus) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);
      if (activeIndex !== overIndex) {
        setTasks((prev) => arrayMove(prev, activeIndex, overIndex));
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const overTask = tasks.find((t) => t.id === overId);
    const newStatus = overTask?.status || overId;
    if (activeTask.status !== newStatus) {
      setTasks((prev) =>
        prev.map((t) => (t.id === activeId ? { ...t, status: newStatus } : t))
      );
    }
  };

  // --- Añadir y eliminar tareas sin componentes externos ---
  const handleAddTask = () => {
    const title = prompt("Título de la nueva tarea:");
    if (!title) return;
    const description = prompt("Descripción breve:");
    const newTask = {
      id: Math.max(...tasks.map((t) => t.id), 0) + 1,
      title,
      description: description || "",
      createdAt: new Date(),
      status: "todo",
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (id) => {
    if (confirm("¿Eliminar esta tarea?")) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "sans-serif",
        background: "#f3f4f6",
      }}
    >
      {/* Header simple */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2.5rem", margin: 0, color: "#333" }}>
            Mini Kanban
          </h1>
          <p style={{ color: "#666" }}>Organiza tus tareas fácilmente</p>
        </div>
        <button
          onClick={handleAddTask}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          + Nueva tarea
        </button>
      </header>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id)}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div style={{ transform: "rotate(3deg)", opacity: 0.9 }}>
              <TaskCard task={activeTask} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
