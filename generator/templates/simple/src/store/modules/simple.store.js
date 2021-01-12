import Vue from 'vue'
import Vuex from 'vuex'
import * as base64 from 'byte-base64'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    agentPubKey: '',
    cellId: '',
    things: []
  },
  actions: {
    async initialise ({ commit }) {
      commit('agentPubKey', base64.base64ToBytes(localStorage.getItem('agentPubKey')))
      commit('cellId', [base64.base64ToBytes(localStorage.getItem('cellId')), base64.base64ToBytes(localStorage.getItem('agentPubKey'))])
    },
    fetchThings ({ rootState, state, commit }) {
      rootState.db.things.toArray(things => {
        commit('setThings', things)
        rootState.hcClient
          .callZome({
            cap: null,
            cell_id: state.cellId,
            zome_name: 'simple',
            fn_name: 'list_things',
            provenance: state.agentPubKey,
            payload: { parent: 'Things' }
          })
          .then(result => {
            result.things.forEach(thing => {
              rootState.db.things.put(thing).then((result) => console.log(result))
            })
            commit('setThings', result.things)
          })
      })
    },
    saveThing ({ rootState, state, commit }, payload) {
      const thing = { ...payload.thing, parent: 'Things' }
      rootState.db.things.put(thing)
      if (thing.entryHash) {
        rootState.hcClient
          .callZome({
            cap: null,
            cell_id: state.cellId,
            zome_name: 'simple',
            fn_name: 'delete_thing',
            provenance: state.agentPubKey,
            payload: thing
          })
      }
      rootState.hcClient
        .callZome({
          cap: null,
          cell_id: state.cellId,
          zome_name: 'simple',
          fn_name: 'create_thing',
          provenance: state.agentPubKey,
          payload: thing
        })
        .then(committedThing => {
          committedThing.entryHash = base64.bytesToBase64(committedThing.entryHash)
          if (payload.action === 'create') {
            commit('createThing', committedThing)
          } else {
            commit('updateThing', committedThing)
          }
        })
    },
    deleteThing ({ rootState, state, commit }, payload) {
      const thing = payload.thing
      console.log(thing)
      rootState.db.things.delete(thing.uuid)
      commit('deleteThing', thing)
      rootState.hcClient
        .callZome({
          cap: null,
          cell_id: state.cellId,
          zome_name: 'simple',
          fn_name: 'delete_thing',
          provenance: state.agentPubKey,
          payload: thing
        })
    }
  },
  mutations: {
    agentPubKey (state, payload) {
      state.agentPubKey = payload
    },
    cellId (state, payload) {
      state.cellId = payload
    },
    setThings (state, payload) {
      const things = payload
      state.things = things
    },
    createThing (state, payload) {
      state.things.splice(0, 0, payload)
    },
    updateThing (state, payload) {
      state.things = state.things.map(thing =>
        thing.uuid !== payload.uuid ? thing : { ...thing, ...payload }
      )
    },
    deleteThing (state, payload) {
      state.things = state.things.filter(c => c.uuid !== payload.uuid)
    }
  },
  modules: {}
}
