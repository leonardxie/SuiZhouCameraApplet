import Vue from 'vue'
import UniRouteGuards from 'uniapp-route-guards';
import utils from '../utils/utils.js'

Vue.use(UniRouteGuards);

const guard = new UniRouteGuards();

// // 自定义路由拦截白名单
// const WHILE_LIST = ['/src/pages/home', '/src/pages/log'];

// // 跳过路由白名单拦截
// guard.beforeEach((to, from, next) => {
//     if (WHILE_LIST.includes(from.url)) {
//         return next(to.url);
//     }

//     next();
// });

// 拦截 调用 uni.switchTab 页面C并跳转到 页面D
guard.beforeEach((to, from, next) => {
	let sessionid = utils.getSessionID();

	console.log(to)
	if (to.path === '/pages/Login/Login') {
		if (sessionid === '' || sessionid == null) {
			next(to.url)
		} else {
			return next({
				url: '/pages/Login/Login',
				action: 'redirectTo'
			});
		}
		getApp().globalData.tabIndex = 1;
	} else {
		if (sessionid === '' || sessionid == null) {
			return next({
				url: '/pages/Login/Login',
				action: 'redirectTo'
			});
		} else {
			next(to.url);
		}
	}
});
