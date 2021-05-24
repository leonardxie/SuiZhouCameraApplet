<template>
	<view class="home">
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-theme-color" id="customNav">
			<block slot="content">随车吊直播</block>
		</cu-custom>
		<!--选项卡-->
		<scroll-view scroll-x scroll-y class="bg-white nav text-center">
			<view class="cu-item" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tabText" :key="index" @tap="tabSelect"
			 :data-id="index">
				{{item}}
			</view>
		</scroll-view>
		<swiper class="depot-swiper margin-bottom" :current="TabCur" @change="SwiperChange">
			<swiper-item class="swiper-item">
				<!--放直播页组件-->
				<Broadcast></Broadcast>
			</swiper-item>
			<swiper-item>
				<!--放直播预告组件-->
				<BroadcastPreview></BroadcastPreview>
			</swiper-item>
		</swiper>
	</view>
</template>


<script>
	import utils from '../../../utils/utils.js';
	import Broadcast from '../../../components/broadcast/broadcast.vue';
	import BroadcastPreview from '../../../components/broadcastPreview/broadcastPreview.vue'
	
	export default {
		components: {
			Broadcast,
			BroadcastPreview
		},
		data() {
			return {
				//页面信息
				pageInfo: {
					name: "查看",
					pageId: 0
				},
				tabText: ['车厂直播', '直播预告'],
				TabCur: 0,
				applyTable: [],
			}
		},
		onShow() {
			getApp().globalData.tabIndex = this.pageInfo.pageId;
		},
		created() {
			this.justEverLogin()
			this.GetData()
		},
		onShareAppMessage(){
			return {
				from:"menu"
			}
		},
		onShareTimeline(){},
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
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
			},
			SwiperChange(e) {
				const current = e.detail.current
				this.TabCur = current;
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
		display: flex;
		overflow-x: hidden;
		overflow-y:auto;
	}

	.home {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		
		.depot-swiper {
			height: 95vh;

			.swiper-item {
				height: 95%;
				overflow: hidden;
			}
		}
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
