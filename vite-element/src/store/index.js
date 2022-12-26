import { createApp } from 'vue'
import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      count: 0,
      userInfo:{
        id:'10'
      }
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  getters() {
    return state.userInfo.id
  },
  actions() {

  },
})

export default store;
