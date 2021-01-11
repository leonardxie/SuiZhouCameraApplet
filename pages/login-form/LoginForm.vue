<template>
	<view>
		<view class="solid-bottom text-xl padding" style="margin-top: 160rpx;">
			<text>随州汽车监控程序</text>
		</view>
		<!--小程序轮播图-->
		<view>
			<text>这里放轮播图</text>
		</view>
		<form ref="loginref" :model="user">
			<!--角色选择 -->
			<view class="cu-form-group " style="margin-top: 50rpx;margin-left: 5%;width: 90%;">
				<label style="font-size: 120%;width: 155rpx;">角色选择</label>
				<view class="cu-list grid col-3"></view>
				<picker mode='selector' @change="bindPickerChange" :range="array" :range-key="'label'">
					<label class="" style="font-size: 120%;">{{array[index].label}}</label>
				</picker>
			</view>
			<!-- 账号 -->
			<view class="cu-form-group" style="margin-top: 50rpx;margin-left: 5%;width: 90%;">
				<view class="title" style="font-size: 120%;width: 155rpx;">账号 </view>
				<input placeholder="请输入账号" type='text' v-model="user.username"></input>
				<text class="cuIcon-people lg text-gray"></text>
			</view>
			<!-- 密码 -->
			<view class="cu-form-group" style="margin-top: 50rpx;margin-left: 5%;width: 90%;">
				<view class="title" style="font-size: 120%;width: 155rpx;">密码 </view>
				<input placeholder="请输入密码" password v-model="user.password" type="text" :password="showPassword" value=""
				 placeholder-class="pstyle"> </input>
				<text :class="[!showPassword?'cuIcon-attention lg text-gray':'cuIcon-attentionforbid text-gray']" @click="showPwd"></text>
			</view>
			<!-- 验证码 -->
			<view class="flex p-xs margin-bottom-sm mb-sm" style="height: 40px;margin-left: 5%;margin-right: 5%;margin-top: 50rpx;">
				<view class="cu-form-group flex-twice">
					<view class="title" style="font-size: 120%;width: 155rpx;">验证码 </view>
					<input placeholder="请输入验证码" v-model="user.code"></input>
				</view>
				<view class="flex-sub" style="text-align: right;height: 100rpx;">
					<image v-bind:src="myImage" @click="getindentify" style="height: 100%;width: 100%;"></image>
				</view>
			</view>
		</form>
		<!-- 登录按钮 -->
		<view>
			<button @click="login" url="" class="cu-btn round bg-blue" role="button" aria-disabled="false" style="width: 80%;margin-left: 10%;margin-top: 20px;height: 100rpx;">登录</button>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/utils.js'
	export default {
		data() {
			return {
				showPassword: true,
				array: [{
						id: 'staff',
						label: '经销商'
					},
					{
						id: 'employee',
						label: '厂家'
					},
					{
						id: 'owner',
						label: '货主'
					}
				],
				index: 0,
				user: {
					role: '',
					username: '',
					password: '',
					code: '',
					ctoken: ''
				}
			}
		},
		mounted: function() {
			//页面刷新时执行
			this.getindentify();
		},
		methods: {
			// 角色选择
			//下拉框
			bindPickerChange: function(e) { //改变的事件名
				//console.log('picker发送选择改变，携带值为', e.target.value)   用于输出改变索引值
				this.index = e.target.value //将数组改变索引赋给定义的index变量
				this.jg = this.array[this.index] //将array【改变索引】的值赋给定义的jg变量
				//	console.log("籍贯为：",this.jg)		//输出获取的籍贯值，例如：中国
			},
			//密码显示
			showPwd: function() {
				this.showPassword = !this.showPassword;
			},
			//验证码
			getindentify() {
				const that = this;
				uni.request({

					method: 'get',
					url: this.$request.baseUrl + '/public/captcha',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log(res);
						this.user.ctoken = res.data.data.cToken;
						let Urlimg = res.data.data.img;
						Urlimg = Urlimg.replace(/[\r\n]/g, "")
						that.$scope.setData({
							myImage: Urlimg
						});
					}
				});

			},
			// 登录验证
			login() {
				let _this = this;
				if (this.user.username === '' || this.user.password === '') {
					uni.showToast({
						title: '用户名或密码为空',
						duration: 2000
					});
				} else {
					let Data = {
						username: this.user.username.replace(/\s+/g, ''),
						password: this.user.password.replace(/\s+/g, ''),
						loginType: this.array[this.index].id,
						code: this.user.code,
						cToken: this.user.ctoken,
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
								//传递sessionID
								utils.storageSessionID(res.data.data.sessionId);
								utils.storageRealName(res.data.data.realName);
								utils.storageLoginType(res.data.data.loginType);
								utils.storageUserName(res.data.data.userName);
								utils.storageUserId(res.data.data.userId);
								uni.switchTab({
									url: "../../pages/stafftabbar/view/view"
								});
								uni.showToast({
									title: '登陆成功',
									duration: 2000
								});
							} else if (res.data.code === 204) {
								uni.showToast({
									title: '帐号为空',
									image: '../../static/error.png',
									duration: 2000
								});
							} else if (res.data.code === 202) {
								uni.showToast({
									title: '帐号或密码错误',
									image: '../../static/error.png',
									duration: 2000
								});
							} else if (res.data.code === 206) {
								uni.showToast({
									title: '验证码错误',
									image: '../../static/error.png',
									duration: 2000
									// let BASE_URL
									// let PORT
									// if (process.env.NODE_ENV === 'development') {
									// 	BASE_URL = _this.$store.state.localIP //本地环境 ip
									// 	if (this.user.select === "staff") {
									// 		PORT = _this.$store.state.localStaffPort
									// 	} else if (this.user.select === "employee") {
									// 		PORT = _this.$store.state.localEplPort
									// 	} else {
									// 		PORT = _this.$store.state.localOwnerPort
									// 	}
									// } else {
									// 	BASE_URL = _this.$store.state.originIP //线上环境 线上域名
									// 	if (this.user.select === "staff") {
									// 		PORT = _this.$store.state.originStaffPort
									// 	} else if (this.user.select === "employee") {
									// 		PORT = _this.$store.state.originEplPort
									// 	} else {
									// 		PORT = _this.$store.state.originOwnerPort
									// 	}
									// }

									// window.location.href = BASE_URL + ":" + PORT

								});
							}
						}
					});
				}

			}
		}
	}
</script>

<style>
</style>
