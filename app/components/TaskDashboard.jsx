"use client";

import { useState} from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Task from "./Task";
const TaskDashboard = ({ tasks }) => {
  const [task, setTask] = useState("");
  const [warningEmptyVisibility, setWarningEmptyVisibility] = useState(false);
  const [warningDuplicateVisibility, setWarningDuplicateVisibility] =
    useState(false);
  const router = useRouter();

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const handleSubmitNewTask = async (e) => {
    e.preventDefault();
    if (task.trim() === "") {
      setWarningEmptyVisibility(true);
      setWarningDuplicateVisibility(false);
      return;
    }

    if (tasks.find((t) => t.todo === task)) {
      setWarningDuplicateVisibility(true);
      setWarningEmptyVisibility(false);
      return;
    }
    try {
      const response = await fetch(`/api/task`, {
        method: "POST",
        body: JSON.stringify({
          id: uuidv4(),
          todo: task,
          isCompleted: false,
        }),
      });

      if (response.ok) {
        setWarningEmptyVisibility(false);
        setWarningDuplicateVisibility(false);
        setSearchText("");
        setTask("");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return tasks.filter(
      (item) =>
        regex.test(item.todo) 
    );
  };


  return (
    <>
      <div className="w-full flex flex-col justify-center">
        <form className="w-full flex justify-center">
          <label className="input input-bordered flex items-center gap-2 w-full">
            <input
              type="text"
              className="grow"
              placeholder="Search Task"
              value={searchText}
              onChange={handleSearchChange}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </form>
        <form
          onSubmit={handleSubmitNewTask}
          className="w-full flex justify-center mt-8"
        >
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            type="text"
            placeholder="Create New Task"
            className="input input-bordered w-full max-w-xl"
          />
        </form>

        <div
          role="alert"
          className={
            "alert alert-warning mt-8 " +
            (warningEmptyVisibility ? "" : "hidden")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Warning: Task Cannot Be Empty</span>
        </div>
        <div
          role="alert"
          className={
            "alert alert-warning mt-8 " +
            (warningDuplicateVisibility ? "" : "hidden")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Warning: You Enter Duplicate Task</span>
        </div>
      </div>
      <div className="w-full flex justify-center mt-20">
        { tasks.length === 0 ? (
            <h1 className="text-3xl font-bold text-center text-gray-400 drop-shadow-xl">Empty</h1>
          ) : 
          (
            <>
            { searchedResults.length === 0 && searchText != '' ?
              (<div role="alert" className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>No result. Create a new one instead!</span>
              </div>) : 
              (<table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Tasks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  { searchText === ''? 
                  (tasks.map((task) => (
                    <Task key={task.id} task={task} />
                  ))) 
                  : (searchedResults.map((task) => (
                    <Task key={task.id} task={task} />
                  ))) }
                </tbody>
              </table>)
                }
            </>
          )
          
        }
      </div>
    </>
  );
};

export default TaskDashboard;
