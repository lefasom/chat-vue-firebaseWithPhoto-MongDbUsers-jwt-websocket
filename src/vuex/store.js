// src/store.js
import { createStore } from 'vuex'
import { db } from '../firebase/firebase'
import { getDocs, collection, doc, deleteDoc, addDoc, updateDoc, getDoc, query, orderBy, onSnapshot } from 'firebase/firestore'
import Axios from 'axios'
Axios.defaults.baseURL = "http://localhost:3001"
const store = createStore({
  state() {
    return {
      modoNocturno: false,
      mensajes: [],
      usuario: {
        userName: '',
        password: '',
        email: '',
        photo: '',
        connection: false,
        _id: '',
      },
      id: null,
      usuarios: [],
      conexion: localStorage.getItem('connection') || false
    };
  },
  mutations: {

    // modoNocturno

    setModoNocturno(state) {
      state.modoNocturno = !state.modoNocturno
    },

    // chat

    setMensajes(state, msj) {
      state.mensajes = msj
    },

    // usuarios

    setUsuario(state, value) {
      state.usuario.userName = value.userName
      state.usuario.password = value.password
      state.usuario.email = value.email
      state.usuario.photo = value.photo
      state.usuario.connection = !value.connection
      state.usuario._id = value._id
    },

    setUsuarios(state, us) {
      state.usuarios = us
    },

    setConexion(state) {
      state.conexion = !state.conexion
    },

  },
  actions: {

    // modoNocturno

    modificoModoNocturno({ commit }) {
      commit('setModoNocturno')
    },

    // chat

    async fetchMensajes({ commit }) {
      const mensajesRef = collection(db, 'mensajes');
      const orderedQuery = query(mensajesRef, orderBy('fecha'));
      onSnapshot(orderedQuery, (snapshot) => {
        const msj = snapshot.docs.map((doc) => ({
          id: doc.id,
          value: doc.data()
        }));
        commit('setMensajes', msj)
      });
    },

    async crearMensaje({ commit }, value) {
      const collectionRef = collection(db, 'mensajes');
      const docRef = await addDoc(collectionRef, value);
    },

    async borrarMensaje({ commit }, id) {
      await deleteDoc(doc(db, 'mensajes', id))
    },

    // usuarios

    setConexion({ commit }) {
      commit('setConexion')
    },

    async createUsuario({ commit }, value) {
      const resp = await Axios.post('/postUser', value)
    },

    async getUsuarios({ commit }) {
      const resp = await Axios.get('/getUsers')
      const us = resp.data
      commit('setUsuarios', us)
    },

    async updateUsuario({ commit }, value) {// Muestro si los usuarios estan conectados en el servidor

      const resp = await Axios.put('/updateUser', value)
    },

    async setUsuario({ commit }, value) {
      try {
        const resp = await Axios.post('/getUser', {
          userName: value.userName,
          password: value.password,
        })
        if (resp) {
          const val = resp.data.user
          // Muestro si los usuarios estan conectados en el servidor => {
          const value = {
            userName: val.userName,
            password: val.password,
            email: val.email,
            photo: val.photo,
            connection: true,
            _id: val._id
          }
          await store.dispatch('updateUsuario', value)
          // } <= Muestro si los usuarios estan conectados en el servidor
          commit('setUsuario', value)
          commit('setConexion')
        }
        return resp
      } catch (error) {
        console.log(error)
      }
    },
    async setDatosUsuario({ commit }, value) {
      commit('setUsuario', value)
    }
  }
})

export default store