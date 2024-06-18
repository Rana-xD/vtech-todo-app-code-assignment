import supabase from '../../utils/initSupabase';

export async function GET () {
    const { data } = await supabase.from("task").select();
    return new Response(JSON.stringify(data), { status: 200 })
}

export async function POST (request) {
    const { id, todo, isCompleted } = await request.json();
    console.log(id, todo, isCompleted);
    try {
        const { data, error } = await supabase
        .from("task")
        .insert([{ id, todo, isCompleted }]);
        return new Response("Success", { status: 200 })
    }catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
    
}