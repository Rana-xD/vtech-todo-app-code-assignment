"use client";

import { useState } from "react";
import { FiEdit, FiTrash2, FiXSquare, FiCheckSquare } from "react-icons/fi";
import Modal from "./Modal";
import { useRouter } from "next/navigation";

const Task= ({ task }) => {
  const router = useRouter();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDeleted, setOpenModalDeleted] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(task.todo);

  const handleSubmitEditTodo = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`/api/task/${task.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                todo: taskToEdit,
            }),
        });
        if (response.ok) {
            setOpenModalEdit(false);
            router.refresh();
        }
      } catch (error) {
        console.log(error);
      } 
  };

  const handleDeleteTask = async (id) => {
    try {
        const response = await fetch(`/api/task/${id}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
            setOpenModalDeleted(false);
            router.refresh();
        }
      } catch (error) {
        console.log(error);
      } 
  };

  const handleCompleteTask = async (id) => {
    console.log(id);
    try {
        const response = await fetch(`/api/task/${id}`, {
            method: "PATCH",
            body: JSON.stringify({
                isCompleted: true,
            }),
        });
        if (response.ok) {
            router.refresh();
        }
      } catch (error) {
        console.log(error);
      } 
  };

  const handleUncompleteTask = async (id) => {
    try {
        const response = await fetch(`/api/task/${id}`, {
            method: "PATCH",
            body: JSON.stringify({
                isCompleted: false,
            }),
        });
        if (response.ok) {
            router.refresh();
        }
      } catch (error) {
        console.log(error);
      } 
  };

  return (
    <tr key={task.id}>
      <td className={'w-full ' + (task.isCompleted ? 'line-through' : '')}>{task.todo}</td>
      <td className='flex gap-5'>
        <FiEdit
          onClick={() => setOpenModalEdit(true)}
          cursor='pointer'
          className='text-blue-500'
          size={25}
        />
        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form onSubmit={handleSubmitEditTodo}>
            <h3 className='font-bold text-lg'>Edit Task</h3>
            <div className='modal-action'>
              <input
                value={taskToEdit}
                onChange={(e) => setTaskToEdit(e.target.value)}
                type='text'
                placeholder='Type here'
                className='input input-bordered w-full'
              />
            </div>
          </form>
        </Modal>
        <FiTrash2
          onClick={() => setOpenModalDeleted(true)}
          cursor='pointer'
          className='text-red-500'
          size={25}
        />
        <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted}>
          <h3 className='text-lg'>
            Are you sure, you want to delete this task?
          </h3>
          <div className='modal-action'>
            <button onClick={() => handleDeleteTask(task.id)} className='btn'>
              Yes
            </button>
          </div>
        </Modal>
        {
            task.isCompleted ? (
                <FiXSquare
                    onClick={() => handleUncompleteTask(task.id)}
                    cursor='pointer'
                    className='text-red-500'
                    size={25}
                />
            ) : (
                <FiCheckSquare
                    onClick={() => handleCompleteTask(task.id)}
                    cursor='pointer'
                    className='text-green-500'
                    size={25}
                />
            )
        }
      </td>
    </tr>
  );
};

export default Task;