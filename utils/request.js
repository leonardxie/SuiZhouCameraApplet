// request.js
import createAjax from 'uni-ajax';
import utils from './utils.js'

let baseUrl = 'https://zb.whut-yj.com'

// Default configuration
const ajax = createAjax({
	baseUrl: baseUrl
});

ajax.interceptors.request.use(request => {
	// Do something before request is sent
	let sessionid = utils.getSessionID()
	if (sessionid === '' || sessionid == null) {
		uni.redirectTo({
			url: '/pages/Login/Login.vue'
		});
	}
	request.header.Authorization = sessionid
	return request;
}, error => {
	// Do something with request error
	return error;
});

ajax.interceptors.response.use(response => {
	// Do something with response data
	return response;
}, error => {
	// Do something with response error
	if (error.response) {
		switch (error.response.statusCode) {
			case 401:
				utils.delSessionID();
				uni.redirectTo({
					url: '/pages/Login/Login.vue'
				});
		}
	}
	return error;
});

const request = ajax.request;

export default request;
