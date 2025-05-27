import React, { useState, useEffect } from "react";
import { Plus, X, Check, Calendar } from "lucide-react";

export default function Todo() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("todoTasks");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error reading tasks from localStorage:", error);
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("todoTasks", JSON.stringify(tasks));
      console.log("Saved tasks to localStorage:", tasks);
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }, [tasks]);

  const addTask = () => {
    const trimmedInput = input.trim();
    if (trimmedInput === "") return;

    const newTask = {
      id: Date.now(),
      text: trimmedInput,
      completed: false,
      date: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    setInput("");
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    let statusMatch = true;
    if (filter === "active") statusMatch = !task.completed;
    if (filter === "completed") statusMatch = task.completed;

    let dateMatch = true;
    if (dateFilter) {
      const taskDate = new Date(task.date).toDateString();
      const filterDate = new Date(dateFilter).toDateString();
      dateMatch = taskDate === filterDate;
    }

    return statusMatch && dateMatch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "date") return new Date(b.date) - new Date(a.date);
    if (sortBy === "alphabetical") return a.text.localeCompare(b.text);
    if (sortBy === "status") return a.completed - b.completed;
    return 0;
  });

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTask();
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        My To-Do List
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex gap-2 text-sm">
          <div className="flex gap-1">
            {["all", "active", "completed"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded ${
                  filter === filterType
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="date">Date</option>
            <option value="alphabetical">A-Z</option>
            <option value="status">Status</option>
          </select>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        {completedCount} of {totalCount} tasks completed
      </div>

      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {tasks.length === 0
              ? "No tasks yet. Add your first task above!"
              : dateFilter
              ? `No ${
                  filter === "all" ? "" : filter + " "
                }tasks found for selected date.`
              : `No ${filter} tasks.`}
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                task.completed
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  task.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 hover:border-green-400"
                }`}
              >
                {task.completed && <Check size={16} />}
              </button>

              <div className="flex-1">
                <span
                  className={`block ${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  {task.text}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(task.date).toLocaleDateString()}
                </span>
              </div>

              <button
                onClick={() => removeTask(task.id)}
                className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
              > Delete
              </button>
            </div>
          ))
        )}
      </div>

      {completedCount > 0 && (
        <button
          onClick={() => setTasks(tasks.filter((task) => !task.completed))}
          className="w-full mt-4 py-2 text-red-500 hover:text-red-700 transition-colors text-sm"
        >
          Clear completed tasks
        </button>
      )}
    </div>
  );
}
