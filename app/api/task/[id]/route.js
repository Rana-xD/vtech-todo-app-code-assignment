import supabase from "../../../utils/initSupabase";
export const PATCH = async (request, { params }) => {
  const { todo, isCompleted } = await request.json();

  try {
    if (!todo) {
      const { data, error } = await supabase
        .from("task")
        .update({ isCompleted: isCompleted })
        .match({ id: params.id });
    } else {
      const { data, error } = await supabase
        .from("task")
        .update({ todo: todo })
        .match({ id: params.id });
    }

    return new Response("Success", { status: 200 });
  } catch (error) {
    return new Response("Failed to update task", { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  try {
    const { data, error } = await supabase
      .from("task")
      .delete()
      .match({ id: params.id });
    return new Response("Success", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete task", { status: 500 });
  }
};
