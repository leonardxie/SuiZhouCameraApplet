<template>
	<view class="home">
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-theme-color" id="customNav">
			<block slot="content">监控小程序</block>
		</cu-custom>
		<!--根据不同的身份显示不同的页面-->
		<view class="send">
			<button @click="createProject" class="cu-btn cuIcon send-button">
				<text class="cuIcon-add send-icon"></text>
			</button>
		</view>
	</view>
</template>


<script>
	import utils from '../../../utils/utils.js';
	
	export default {
		components: {
		},
		data() {
			return {
				loginRole:'',
				//页面信息
				pageInfo: {
					name: "查看",
					pageId: 0
				}
			}
		},
		onShow() {
			getApp().globalData.tabIndex = this.pageInfo.pageId;
		},
		created() {
			this.justEverLogin()
			this.GetData()
		},
		methods: {
			justEverLogin(){
				//数据库中查询是否有此用户信息
				console.log(utils.getSessionID());
				if(utils.getSessionID()==''||utils.getSessionID()==null){//用户未登录，则重新登录
					uni.redirectTo({
						url: '/pages/Login/Login.vue'
					});
				}
			},
			GetData(){
				uni.request({
					method: 'get',
					url: this.$request.baseUrl + '/depot/select_live_list',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						//console.log(res);
						// if (res.data.code === 201) {
						// 	uni.navigateTo({
						// 		url: "../../Login/Login"
						// 	});
						// } 
					}
				});	
			},
			createProject() {
				uni.navigateTo({
					url: '/pages/send/send'
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
		overflow-x: hidden;
	}

	.home {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;

		.send {
			position: absolute;
			right: 4%;
			bottom: 2%;

			.send-button {
				height: 110rpx;
				width: 110rpx;
				background-color: $jgcy-color-base;
				color: #fff;

				.send-icon {
					font-size: 65rpx;
				}
			}
		}
	}
</style>
