// 时间格式化
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"H+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
			k]).substr(("" + o[k]).length)));
	return fmt;
}

//key
let sessionIDName = "SuiZhouCameraApplet-sessionid"
let realNameKey="Phone"
let loginTypeKey="LoginType"
let userNameKey="UserName"
let userIdKey="UserId"

export default {
	//sessionID
	storageSessionID(sessionID) {
		let timestamp = (new Date()).valueOf() + 3500000;
		uni.setStorageSync(sessionIDName, sessionID + '|' + timestamp);
	},

	getSessionID() {
		const sessionIDAndTime = uni.getStorageSync(sessionIDName);
		return this.validateSessionID(sessionIDAndTime)
	},

	validateSessionID(sessionIDAndTime) {
		if (sessionIDAndTime === '' || sessionIDAndTime == null) {
			return ''
		}

		let [sessionID, timeoutTimestamp] = sessionIDAndTime.split('|')
		let timestampNow = (new Date()).valueOf()
		if (timestampNow >= timeoutTimestamp || sessionID === 'undefined') {
			this.delSessionID()
			return ''
		}

		return sessionID
	},

	delSessionID() {
		uni.removeStorageSync(sessionIDName);
	},
	
	//RealName
	storageRealName(realName) {
		let timestamp1 = (new Date()).valueOf() + 3500000;
		uni.setStorageSync(realNameKey, realName + '|' + timestamp1);
	},
	
	getRealName() {
		const realNameAndTime = uni.getStorageSync(realNameKey);
		return this.validateRealName(realNameAndTime)
	},
	
	validateRealName(realNameAndTime) {
		if (realNameAndTime === '' || realNameAndTime == null) {
			return ''
		}
	
		let [realName, timeoutTimestamp] = realNameAndTime.split('|')
		let timestampNow1 = (new Date()).valueOf()
		if (timestampNow1 >= timeoutTimestamp || realName === 'undefined') {
			this.delRealName()
			return ''
		}
	
		return realName
	},
	
	delRealName() {
		uni.removeStorageSync(realNameKey);
	},
	
	//loginType
	storageLoginType(loginType) {
		let timestamp2 = (new Date()).valueOf() + 3500000;
		uni.setStorageSync(loginTypeKey, loginType + '|' + timestamp2);
	},
	
	getLoginType() {
		const loginTypeAndTime = uni.getStorageSync(loginTypeKey);
		return this.validateLoginType(loginTypeAndTime)
	},
	
	validateLoginType(loginTypeAndTime) {
		if (loginTypeAndTime === '' || loginTypeAndTime == null) {
			return ''
		}
	
		let [loginType, timeoutTimestamp] = loginTypeAndTime.split('|')
		let timestampNow2 = (new Date()).valueOf()
		if (timestampNow2 >= timeoutTimestamp || loginType === 'undefined') {
			this.delLoginType()
			return ''
		}
	
		return loginType
	},
	
	delLoginType() {
		uni.removeStorageSync(loginTypeKey);
	},
	
	//userName
	storageUserName(userName) {
		let timestamp3 = (new Date()).valueOf() + 3500000;
		uni.setStorageSync(userNameKey, userName + '|' + timestamp3);
	},
	
	getUserName() {
		const userNameAndTime = uni.getStorageSync(userNameKey);
		return this.validateUserName(userNameAndTime)
	},
	
	validateUserName(userNameAndTime) {
		if (userNameAndTime === '' || userNameAndTime == null) {
			return ''
		}
	
		let [userName, timeoutTimestamp] = userNameAndTime.split('|')
		let timestampNow3 = (new Date()).valueOf()
		if (timestampNow3 >= timeoutTimestamp || userName === 'undefined') {
			this.delUserName()
			return ''
		}
	
		return userName
	},
	
	delUserName() {
		uni.removeStorageSync(userNameKey);
	},
	
	//userId
	storageUserId(userId) {
		let timestamp4 = (new Date()).valueOf() + 3500000;
		uni.setStorageSync(userIdKey, userId + '|' + timestamp4);
	},
	
	getUserId() {
		const userIdAndTime = uni.getStorageSync(userIdKey);
		return this.validateUserId(userIdAndTime)
	},
	
	validateUserId(userIdAndTime) {
		if (userIdAndTime === '' || userIdAndTime == null) {
			return ''
		}
	
		let [userId, timeoutTimestamp] = userIdAndTime.split('|')
		let timestampNow4 = (new Date()).valueOf()
		if (timestampNow4 >= timeoutTimestamp || userId === 'undefined') {
			this.delUserId()
			return ''
		}
	
		return userId
	},
	
	delUserId() {
		uni.removeStorageSync(userIdKey);
	},
}