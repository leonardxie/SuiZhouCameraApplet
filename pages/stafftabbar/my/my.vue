<template>
	<view>
		<cu-custom bgColor="bg-theme-color" id="customNav">
			<block slot="content">我的</block>
		</cu-custom>
		
		<!--头像与用户名 -->
		<view class="flex p-xs margin-bottom-sm mb-sm" style="background-color: #fff;">
			<view class="cu-avatar xl margin" >
				<image :src="profilePhoto" mode="aspectFit"></image>
			</view>		
			<view class="solid-bottom  padding " style="display: flex; width: 100%;font-size: x-large;">
				<span>{{nickName}}</span>
				<br>
				<span>{{}}</span>
			</view>
		</view>
		<!--车厂信息-->
		<FactoryInformation></FactoryInformation>
		<!-- 列表 --> 
		<view class="cu-list menu margin-top">
			
			
		</view>
		<view class="flex">
			<view class="flex-sub  padding-sm margin-xs radius">
				<button  class="cu-btn bg-red margin-tb-sm lg" role="button" aria-disabled="false" @share="share" open-type="share"
			  style="width: 80%;margin-left: 10%;margin-top: 10px;">分享</button>
			</view>
			<view class="flex-sub  padding-sm margin-xs radius">
				<button @click="loginout" url="" class="cu-btn bg-red margin-tb-sm lg" role="button" aria-disabled="false"
				  style="width: 80%;margin-left: 10%;margin-top: 10px;">退出</button>
			</view>
		</view>
	</view>
</template> 

<script>
	import utils from '../../../utils/utils.js';
	import FactoryInformation from '../../../components/factory-information/factory-information.vue';
	
	export default {
		components:{
			FactoryInformation
		},
		data() {
			return {
				profilePhoto:'',
				nickName:'',
				location:'',
				//页面信息
				pageInfo: {
					name: "我的",
					pageId: 2
				},
			}
		},
		onShow() {
			getApp().globalData.tabIndex = this.pageInfo.pageId;
		},
		created() {
			const value = uni.getStorageSync('userInfo');
			if (value) {
			  console.log(value);
				this.profilePhoto=value.avatarUrl;
				this.nickName=value.nickName;
			}
			
		},
		mounted(){
		},
		methods: {
			
			loginout() {
				utils.delSessionID();
				utils.delLoginType();
				utils.delUserName();
				utils.delUserId();
				uni.clearStorageSync();	
				//移除红点提示
				uni.removeTabBarBadge({
					index: 1
				});
				getApp().globalData.tabIndex = 1;
				uni.navigateTo({
					url: "/pages/Login/Login"
				});
			},
			share(){
				uni.share({
				    provider: "weixin",
				    scene: "WXSceneSession",
				    type: 1,
				    summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});		
			}
		}
	}
</script>

<style>
</style>
