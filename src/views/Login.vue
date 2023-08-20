<template>
    <div :class="modoNocturno ? 'container' : 'container2'">
        <LogoAndMenu />
        <div class="user-registration">
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="alias">Usuario o email:</label>
                    <input v-model="userName" type="text">
                </div>
                <div class="form-group">
                    <label for="password">Contraseña:</label>
                    <input v-model="password" type="password">
                </div>
                <button @click="entrar" type="submit">Entrar</button>
            </form>
        </div>
    </div>
</template>
<script>

import LogoAndMenu from "../components/LogoAndMenu.vue";
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'Login',

    components: {
        LogoAndMenu,
    },

    setup() {
        const router = useRouter()
        const userName = ref('')
        const password = ref('')

        const store = useStore();
        const modoNocturno = computed(() => store.state.modoNocturno);
        const usuarios = computed(() => store.state.usuarios);

        const entrar = () => {
            let estado = []
            try {
                estado = usuarios.value.find(val => {
                    return (
                        (val.userName === userName.value && val.password === password.value) ||
                        (val.email === userName.value && val.password === password.value)
                    )
                })

                if (estado != '') {
                    const state = true
                    console.log(estado)
                    const value =
                    {
                        _id: estado._id,
                        userName: estado.userName,
                        password: estado.password,
                        email: estado.email,
                        phote: estado.phote,
                        connection: !estado.connection
                    }

                    localStorage.setItem('userName', value.userName)
                    localStorage.setItem('password', value.password)
                    localStorage.setItem('email', value.email)
                    localStorage.setItem('phote', value.phote)
                    localStorage.setItem('_id', value._id)
                    localStorage.setItem('connection', value.connection)

                    store.dispatch('setUser', value) // Centralizo datos del usuario
                    store.dispatch('updateUsuario', value) // Modifico su estado de 'connection' en la base de datos
                    store.dispatch('setConexion') // Este es para el ui ( habilita y desabilita prestasiones)
                    router.push('/')
                }

            } catch (error) {
                console.log(error)
            }
        }

        onMounted(async () => {
            await store.dispatch('getUsers')
        })

        return {
            entrar,
            userName,
            password,
            modoNocturno
        }
    }
}

</script>
  
<style scoped>
.router {
    text-decoration: none;
    color: #FEFDFC;
}


h1 {
    padding: 15px 10px;
    font-size: 22px;
    color: #3192c7;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;

}

.container {
    background-color: #0C1D25;
    height: 100vh;
}

.container2 {
    background-color: #fff;
    height: 100vh;
}

.container .user-registration {
    font-family: Arial, sans-serif;
    width: 80%;
    max-width: 500px;
    margin: auto;
    padding: 20px;
    border-radius: 5px;
    background-color: #0C1D25;
    margin-top: 10%;
}

.container2 .user-registration {
    font-family: Arial, sans-serif;
    width: 80%;
    max-width: 500px;
    margin: auto;
    padding: 20px;
    border-radius: 5px;
    background-color: #fff;
    margin-top: 10%;
}

h2 {
    color: #FEFDFC;
}

.form-group {
    margin: 15px;
}

label {
    display: block;
    font-size: 15px;
    margin: 5px 0;
    color: #3192c7;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    text-align: start;
}

.container2 input {
    width: 100%;
    padding: 10px;
    border: 1px solid #999;
    border-radius: 5px;
    background-color: transparent;
    color: #3192c7;
}

.container input {
    width: 100%;
    padding: 10px;
    border: 1px solid #999;
    border-radius: 5px;
    background-color: transparent;
    color: #999;
}

button {
    background-color: transparent;
    color: #3192c7;
    padding: 10px 20px;
    border: 1px solid #3192c7;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 14px;

}
</style>
  