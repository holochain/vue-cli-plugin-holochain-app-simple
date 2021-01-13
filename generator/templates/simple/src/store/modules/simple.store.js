import Vue from 'vue'
import Vuex from 'vuex'
import * as base64 from 'byte-base64'
import Dexie from 'dexie'
import { AppWebsocket } from '@holochain/conductor-api'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    agentPubKey: '',
    simpleCellId: '',
    things: []
  },
  actions: {
    async initialise ({ state, commit }) {
      state.db = new Dexie('simple')
      state.db.version(1).stores({
        things: 'uuid'
      })
      state.db.open().catch(function (e) {
        console.error('Open failed: ' + e)
      })
      AppWebsocket.connect(`ws://localhost:${localStorage.getItem('port')}`)
        .then(socket => {
          commit('hcClient', socket)
        })
      commit('agentPubKey', base64.base64ToBytes(decodeURIComponent(localStorage.getItem('agentPubKey'))))
      commit('simpleCellId', base64.base64ToBytes(decodeURIComponent(localStorage.getItem('simpleCellId'))))
    },
    fetchThings ({ state, commit }) {
      console.log(state.simpleCellId)
      state.db.things.toArray(things => {
        commit('setThings', things)
        state.hcClient
          .callZome({
            cap: null,
            cell_id: [state.simpleCellId, state.agentPubKey],
            zome_name: 'simple',
            fn_name: 'list_things',
            provenance: state.agentPubKey,
            payload: { parent: 'Things' }
          })
          .then(result => {
            console.log('🚀 ~ file: simple.store.js ~ line 46 ~ fetchThings ~ result', result)
            result.things.forEach(thing => {
              state.db.things.put(thing).then((result) => console.log(result))
            })
            commit('setThings', result.things)
          })
          .catch(err => console.log(err))
      })
    },
    saveThing ({ state, commit }, payload) {
      const thing = { ...payload.thing, parent: 'Things' }
      state.db.things.put(thing)
      if (payload.action === 'create') {
        commit('createThing', thing)
      } else {
        commit('updateThing', thing)
      }
      if (thing.entryHash) {
        state.hcClient
          .callZome({
            cap: null,
            cell_id: [state.simpleCellId, state.agentPubKey],
            zome_name: 'simple',
            fn_name: 'delete_thing',
            provenance: state.agentPubKey,
            payload: thing
          })
      }
      state.hcClient
        .callZome({
          cap: null,
          cell_id: [state.simpleCellId, state.agentPubKey],
          zome_name: 'simple',
          fn_name: 'create_thing',
          provenance: state.agentPubKey,
          payload: thing
        })
        .then(committedThing => {
          committedThing.entryHash = base64.bytesToBase64(committedThing.entryHash)
          state.db.things.put(committedThing)
          commit('updateThing', committedThing)
        })
    },
    deleteThing ({ state, commit }, payload) {
      const thing = payload.thing
      state.db.things.delete(thing.uuid)
      commit('deleteThing', thing)
      state.hcClient
        .callZome({
          cap: null,
          cell_id: [state.simpleCellId, state.agentPubKey],
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
    simpleCellId (state, payload) {
      state.simpleCellId = payload
    },
    hcClient (state, payload) {
      state.hcClient = payload
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
