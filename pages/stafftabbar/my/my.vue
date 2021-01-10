<template>
	<view>
		<cu-custom bgColor="bg-theme-color" id="customNav">
			<block slot="content">我的</block>
		</cu-custom>
		<view class="flex p-xs margin-bottom-sm mb-sm">
			<!-- 用户名 -->
				<view class="solid-bottom  padding " style="display: flex; align-items: center;justify-content: center;width: 100%;font-size: x-large;background-color: #fff;">
					<span>{{realname}}</span>
				</view>
		
		</view>
		<!-- 列表 -->
		<view class="cu-list menu">
			<view class="cu-item">
				<navigator class="content" hover-class="none" url="/pages/login-form/ModifyForm" open-type="navigate">

					<text class="text-grey">修改密码</text>
					<text class="cuIcon-lock lg text-gray" style="float: right;"></text>
				</navigator>
			</view>
			<view class="cu-item">
				<navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
					<text class="text-grey">帮助中心</text>
					<text class="cuIcon-questionfill lg text-gray" style="float: right;"></text>
				</navigator>
			</view>
			<view class="cu-item">
				<navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
					<text class="text-grey">设置</text>
					<text class="cuIcon-settingsfill lg text-gray" style="float: right;"></text>
				</navigator>
			</view>
		</view>
		<view>
			<button @click="loginout" url="" class="cu-btn bg-red margin-tb-sm lg" role="button" aria-disabled="false" style="width: 80%;margin-left: 10%;margin-top: 20px;">退出登录</button>
		</view>
	</view>
</template>

<script>
	import utils from '../../../utils/utils.js'
	export default {

		data() {
			return {
				//页面信息
				pageInfo: {
					name: "我的",
					pageId: 2
				},
				realname:'',
			}
		},
		onShow() {
			getApp().globalData.tabIndex = this.pageInfo.pageId;
		},
		mounted: function()  {
				this.getName();
		},
		methods: {
			getName(){
				this.realname=utils.getRealName();
			},
			loginout() {
				utils.delSessionID();
				utils.delRealName();
				utils.delLoginType();
				utils.delUserName();
				utils.delUserId();
				//移除红点提示
				uni.removeTabBarBadge({
					index: 1
				});
				getApp().globalData.tabIndex = 1;
				uni.navigateTo({
					url: "/pages/login-form/LoginForm"
				});
				
			}
		}
	}
</script>

<style>

</style>
