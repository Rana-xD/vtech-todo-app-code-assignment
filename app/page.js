"use client";

import TaskDashboard from "./components/TaskDashboard";
import { useState, useEffect} from "react";

export default function Home() {

  const [tasks, setTasks] = useState([]);
  const fetchTasks = async () => {
    const response = await fetch(`/api/task`);
    const data = await response.json();
    setTasks(data);
};

useEffect(() => {
    
    fetchTasks();
},[tasks]);

  return (
    <main className="min-h-screen p-24 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-center text-red-600 drop-shadow-xl">TODO App - VTech Assignment</h1>
      <div className="mt-8 flex flex-col justify-center  w-full max-w-4xl">
        
        <TaskDashboard tasks={tasks} />
      </div>
    </main>
  );
}
