import Vue from 'vue'
import Vuex from 'vuex'
import utils from '../utils/utils.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		historyList: uni.getStorageSync('__history' + utils.getLoginType()) || [],
	},
	mutations: {
		SET_HISTORY(state, history, set) {
			state.historyList = history
		},
		CLEAR_HISTORY(state) {
			state.historyList = []
		}
	},
	actions: {
		set_history({
			commit,
			state
		}, history) {
			console.log(uni.getStorageSync('__history' + utils.getLoginType()))
			let list = state.historyList
			const listHas = (list = [], history) => {
				for(let i = 0; i < list.length; i++) {
					if(list[i].name === history.name) {
						return true
					}
				}
				return false
			}
			if (!listHas(list, history)) {
				list.unshift(history)
				uni.setStorageSync('__history' + utils.getLoginType(), list)
				commit('SET_HISTORY', list)
			}
		},
		clearHistory({
			commit
		}) {
			uni.removeStorageSync('__history' + utils.getLoginType())
			commit('CLEAR_HISTORY')
		},
	}
})


export default store
