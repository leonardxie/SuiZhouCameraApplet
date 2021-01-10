<script>
	import Vue from 'vue'
	import utils from './utils/utils.js'
	
	export default {
		onLaunch: function() {
			// 获取系统信息
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif       
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
		},
		onShow: function() {
			console.log('App Show');
			setInterval(() => {
				this.cirNewMessage();
			}, 15000);
		},
		onHide: function() {
			console.log('App Hide');
		},
		globalData: {
			tabIndex: 1,
		},
		computed:{
			types:function(){
				let types = [1,2,3,4,5,6];
				let loginType = utils.getLoginType();
				if(loginType != "staff"){
					return types.filter(v => v>=4);
				}else{
					return types.filter(v => v<=3);
				}
			}
		},
		methods: {
			// 是否有新消息
			cirNewMessage() {
				let types = [1,2,3,4,5,6];
				let loginType = utils.getLoginType();
				if(loginType != "staff"){
					types = types.filter(v => v>=4);
				}else{
					types = types.filter(v => v<=3);
				}
				let sessionid = utils.getSessionID();
				console.log(sessionid);
				if (getApp().globalData.tabIndex !== 1 && (sessionid !== '' && sessionid !== null)) {
					// console.log("轮询");
					this.$request.get(
						this.$request.baseUrl + "/msg/all_count?types="+types[0]+"&types="+types[1]+"&types="+types[2],
					).then(result => {
						let allCount = result.data.data[result.data.data.length - 1];
						// console.log(allCount);
						if (allCount !== 0) {
							uni.setTabBarBadge({
								index: 1,
								text: `${allCount}`
							})
						}
					})
				}

			}
		}
	};
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "app.css";
</style>
