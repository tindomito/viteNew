<script>
import AppH1 from '../components/AppH1.vue';
import { supabase } from '../services/supabase';

export default {
    name: 'PublicChat',
    components: { AppH1, },
    data(){
        return{
            messages: [

            ],
            newMessage: {
                email: '',
                content: '',
            }
        }
    },
    methods: {
        async handleSubmit(){
            const {data, error} = await supabase
            .from('global_chat_messages')
            .insert({
                email: this.newMessage.email,
                content: this.newMessage.content,
            });
            
            this.newMessage.content = "";
        }
    },
    async mounted(){
        //traer mensajes de SupaBase
        //para interacciones con SupaBase vamos a usar el cliente exportado de [services/supabase.js]


        const { data, error} = await supabase
        .from('global_chat_messages')
        .select('*')
        .order('created_at');

        if(error){
            throw new Error(error);
        }
        this.messages = data;

        const chatChannel = supabase.channel('global_chat');
        chatChannel.on('postgres_changes',
        {
            event: 'INSERT',
            table: 'global_chat_messages',
            schema: 'public', 
        },
        (payload) => {
            this.messages.push(payload.new);
        });

        chatChannel.subscribe();
    }
}
</script>

<template>
    <AppH1>Chat global</AppH1>

    <div class="flex gap-4 ">
        <section class="w-9/12 h-100 p-4 border border-gray-200 rounded overflow-scroll">
            <h2 class="sr-only">Lista de Mensajes</h2>
            <ol>
                <li v-for="message in messages"
                :key="message.id"
                class="p-2 bg-gray-100">
                    <div class="mb-1"><span class="font-bold">{{ message.email }} </span> dijo:</div>
                    <div class="mb-1">{{ message.content }}</div>
                    <div class="mb-1 text-sm text-gray-700">{{ message.created_at }}</div>
                </li>
            </ol>
        </section>
        <section>
            <h2 class="mb-4 text-xl">Enviar un Mensaje</h2>
            <form action="#"
            @submit.prevent="handleSubmit">
                    <div class="mb-4">
                        <label for="email">Email: </label>
                        <input
                         type="email" 
                         id="email" 
                         class=" w-full p-2 border border-gray-400"
                         v-model="newMessage.email">
                    </div>
                    <div class="mb-4">
                        <label for="content">Mensaje: </label>
                        <textarea 
                            name="content"
                            id="content"
                            class="border w-full p-2 border-gray-400"
                            v-model="newMessage.content">
                        </textarea>
                    </div>
                    <button type="submit"
                    class="bg-blue-600 text-white py-2 px-4 rounded cursor-pointer transition duration-200 hover:bg-blue-500
                     ">Enviar</button>
                </form>
        </section>
    </div>
</template>