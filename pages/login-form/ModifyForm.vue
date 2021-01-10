<template>
	<view>
		<!-- 导航 -->
		<cu-custom bgColor="bg-theme-color" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">修改密码</block>
		</cu-custom>
		<form ref="loginref" :model="user">
			<!-- 旧密码-->
			<view class="cu-form-group" style="margin-top: 50rpx;margin-left: 5%;width: 90%;">
				<view class="title" style="width: 25%;">旧密码</view>
				<input placeholder="请输入旧密码" password v-model="user.oldpassword" type="text" :password="showPassword" value=""
				 placeholder-class="pstyle"></input>
				<text :class="[!showPassword?'cuIcon-attention lg text-gray':'cuIcon-attentionforbid text-gray']" @click="showPwd"></text>
			</view>
			<!-- 新密码 -->
			<view class="cu-form-group" style="margin-top: 50rpx;margin-left: 5%;width: 90%;">
				<view class="title" style="width: 25%;">新密码</view>
				<input placeholder="请输入新密码" password v-model="user.password1"></input>
				<text class="cuIcon-lock lg text-gray"></text>
			</view>
			<view class="cu-form-group" style="margin-top: 50rpx;margin-left: 5%;width: 90%;">
				<view class="title" style="width: 25%;">确认密码</view>
				<input placeholder="请再次输入新密码" password v-model="user.password2"></input>
				<text class="cuIcon-lock lg text-gray"></text>
			</view>
		</form>
		<!-- 确认 -->
		<view>
			<button @click="modify" url="" class="cu-btn round bg-blue" role="button" aria-disabled="false" style="width: 80%;margin-left: 10%;margin-top: 20px;height: 100rpx;">确认修改</button>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/utils.js'
	export default {
		data() {
			return {
				showPassword: true,
				user: {
					oldpassword: '',
					password1: '',
					password2: ''
				}
			}
		},
		methods: {
			//密码显示
			showPwd: function() {
				this.showPassword = !this.showPassword;
			},
			modify() {
				let Data = {
					oldPassword: this.user.oldpassword,
					newPassword: this.user.password1,
					newPassword2: this.user.password2,
				};
				this.$request.put(
				this.$request.baseUrl +'/public/update_password',
				 Data,{
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					}
					}
					).then(function(res) {
						console.log(res);
						if (res.data.code === 0) {
							uni.navigateTo({
								url: "LoginForm"
							});
							utils.delSessionID();
							utils.delRealName();
							utils.delLoginType();
							utils.delUserName();
							utils.delUserId();
							uni.showToast({
								title: '修改密码成功',
								duration: 2000
							});
						} else if (res.data.code === 207)
							uni.showToast({
								title: '旧密码错误',
								 image:'../../static/error.png',
								duration: 2000
							});
						else if (res.data.code === 208)
							uni.showToast({
								title: '新密码的两次输入不同',
								 image:'../../static/error.png',
								duration: 2000
							});
					})
			}
		}
	}
</script>

<style>
</style>
