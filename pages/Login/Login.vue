<template>
	<view>
		<view class="solid-bottom padding" style="margin-top: 170rpx;margin-bottom: 50rpx;">
			<text style="font-size: 30px;">随车吊直播小程序</text>
		</view>
	
		<!-- 登录按钮 -->
		<view>
			<image src="../../static/car_pic.jpg" mode="aspectFit" style="width: 100%;"></image>
			<button  class="cu-btn round bg-blue" role="button" aria-disabled="false" 
			style="width: 80%;margin-left: 10%;margin-top: 20px;height: 100rpx;"
				open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true">进入</button>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/utils.js'
	export default {
		data() {
			return {
				
			}
		},
		created() {
			//直接登录
			this.autoLogin();
		},
		mounted: function() {
			//页面刷新时执行
		
		},
		methods: {
			autoLogin(){
				uni.request({
					method: 'get',
					url: this.$request.baseUrl + '/public/captcha',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log(res);
						let Data = {
							phone: '15296794930',
							password: '123456',
							role: 3,
							code: res.data.data.code,
							cToken: res.data.data.cToken,
						};
						uni.request({
							method: 'post',
							url: this.$request.baseUrl + '/public/login',
							data: Data,
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							success: (res) => {
								if (res.data.code === 0) {
									utils.storageSessionID(res.data.data.sessionId);
									utils.storageLoginType(res.data.data.loginType);
									utils.storageUserName(res.data.data.userName);
									utils.storageUserId(res.data.data.userId);
								}  
								
							}
						});
					}
				});	
			},
			// 登录
			getuserinfo() {
				const _this=this;
				uni.login({
					success(res) {
						if (res.code) {
							// 获取微信用户信息
							uni.getUserInfo({
								success: function(res) {
									//用户信息
									console.log(res);
									const userInfo = res.userInfo;
									//性别 0：未知、1：男、2：女
									const { nickName, avatarUrl, gender, province, city, country } = userInfo;
									uni.setStorageSync('userInfo', userInfo);//本地缓存
									console.log(utils.getSessionID());
									let data = {
										avatarUrl: userInfo.avatarUrl,
										city: userInfo.city,
										country: userInfo.country,
										gender: userInfo.gender,
										nickName: userInfo.nickName,
										province: userInfo.province
									};
									console.log(data);
									//将用户的信息存入数据库
									_this.$request.post(
										_this.$request.baseUrl + '/public/add_mpuser', data, {
											header: {
												'Content-Type': 'application/json'
											}
										}).then(function(res) {
											uni.switchTab({
												url: '../stafftabbar/view/view'
											});
									});
								},
								fail: res => {
								  // 获取失败的去引导用户授权
									uni.showToast({
										title: '授权后方可使用！'
									});
								}
							});
					  } 
				  }
				});
			}
		}
	}
</script>

<style>
</style>
