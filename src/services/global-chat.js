import { supabase } from "./supabase";

export async function sendNewGlobalChatMessage({email, content}){
        const {data, error} = await supabase
        .from('global_chat_messages')
        .insert({
            email: email,
            content: content,
        });

}

export async function fetchLastGlobalChatMessages(){
    const { data, error} = await supabase
    .from('global_chat_messages')
    .select('*')
    .order('created_at');
    
    if(error){
        throw new Error(error.message);
    }
    return data;
}

export function subscribeToNewGlobalChatMessages(callback){
        const chatChannel = supabase.channel('global_chat');
        chatChannel.on('postgres_changes',
        {
            event: 'INSERT',
            table: 'global_chat_messages',
            schema: 'public', 
        },
        payload => {
            callback(payload.new);
        });

        chatChannel.subscribe();
}