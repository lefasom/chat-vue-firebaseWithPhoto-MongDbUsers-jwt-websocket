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
        userName: localStorage.getItem('userName') || '',
        password: localStorage.getItem('password') || '',
        email: localStorage.getItem('email') || '',
        phote: localStorage.getItem('phote') || '',
        connection: localStorage.getItem('connection') || false,
        _id: localStorage.getItem('_id') || '',
      },
      id: null,
      usuarios: [],
      conexion: localStorage.getItem('connection') || false
    };
  },
  mutations: {

    // chat

    setMensajes(state, msj) {
      state.mensajes = msj
    },
    // usuarios

    setUsuario(state, value) {
      state.usuario.userName = value.userName
      state.usuario.password = value.password
      state.usuario.email = value.email
      state.usuario.phote = value.phote
      state.usuario.connection = value.connection
      state.usuario._id = value._id


    },
    setUsuarios(state, us) {
      state.usuarios = us
    },
    setConexion(state) {
      state.conexion = !state.conexion
    },
    // modoNocturno

    setModoNocturno(state) {
      state.modoNocturno = !state.modoNocturno
    },
  },
  actions: {
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
    // modoNocturno

    modificoModoNocturno({ commit }) {
      commit('setModoNocturno')
    },
    // usuarios

    async fetchUsuarios({ commit }) {
      const mensajesRef = collection(db, 'usuario');
      const orderedQuery = query(mensajesRef);
      onSnapshot(orderedQuery, (snapshot) => {
        const us = snapshot.docs.map((doc) => ({
          id: doc.id,
          value: doc.data()
        }));

      });
    },
    setConexion({ commit }) {
      commit('setConexion')
    },
    async crearUsuario({ commit }, value) {
      // console.log('cosole de store', value)
      const collectionRef = collection(db, 'usuario');
      const docRef = await addDoc(collectionRef, value);
    },

    async updateUsuario({ commit }, { value, id }) {
      // console.log(id)
      const itemRef = doc(db, 'usuario', id);
      await updateDoc(itemRef, value);
      // console.log('El elemento ha sido editado correctamente');
    },
    async conexion({ commit }, { value, id, state }) {
      const itemRef = doc(db, 'usuario', id);
      let form =
      {
        alias: value.alias,
        contrasena: value.contrasena,
        correo: value.correo,
        foto: value.foto,
        conexion: state
      }
      await updateDoc(itemRef, form);
    },
    async createUser({ commit }, value) {
      console.log(value)
      const resp = await Axios.post('/postUser', value)
    },
    async getUsers({ commit }) {
      const resp = await Axios.get('/getUsers')
      const us = resp.data
      commit('setUsuarios', us)
    },
    async updateUsuario({ commit }, value) {
      const resp = await Axios.put('/updateUser', value)
    },
    async setUser({ commit }, value) {
      console.log(value)
      commit('setUsuario', value)
    }
  }
})

export default store