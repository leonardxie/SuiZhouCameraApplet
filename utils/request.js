// request.js
import createAjax from 'uni-ajax';
import utils from './utils.js'

let baseUrl = 'http://49.234.126.93:8081'

// Default configuration
const ajax = createAjax({
	baseUrl: baseUrl
});

ajax.interceptors.request.use(request => {
	// Do something before request is sent
	let sessionid = utils.getSessionID()
	if (sessionid === '' || sessionid == null) {
		uni.redirectTo({
			url: '/pages/login-form/LoginForm.vue'
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
					url: '/pages/login-form/LoginForm.vue'
				});
		}
	}
	return error;
});

const request = ajax.request;

export default request;
