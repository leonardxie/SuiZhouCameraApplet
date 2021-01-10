<template>
	
	<swiper class="message-swiper" :current="activeIndex" @change="listChange">
		<swiper-item v-for="(index, item) in tab" :key="index" class="message-item">
			<me-scroll class="me-scroll" :up="up" :down="down" @up="upFn" :fixed="false" @down="downFn" @init="initMeScroll">
				<common-attention v-if="checkList.length>0" :current="tab[current].id" :scrollViewHeight="scrollViewHeight" :checkList="checkList"
				 @delItem="handleDel"></common-attention>
				
				<!-- 空空如也 -->
				<view class="null-data" v-if="checkList.length === 0">
					<view class="null-pic">
						<image :src="pic"></image>
					</view>
					<view class="null-info">{{picInfo}}</view>
				</view>
			</me-scroll>
		</swiper-item>
	</swiper>

</template>

<script>
	import commonAttention from "@/pages/stafftabbar/notification/common-attention/common-attention.vue";
	import MeScroll from "@/components/mescroll-uni/mescroll-uni.vue";
	import utils from "@/utils/utils.js";

	export default {
		components: {
			commonAttention,
			MeScroll
		},
		props: {
			tab: {
				type: Array,
				default () {
					return []
				}
			},
			activeIndex: {
				type: Number,
				default: 0
			},
			scrollViewHeight: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				isInit: false, // 是否初始化
				meScroll: null, // mescroll实例对象
				// 上拉配置参数
				up: {
					auto: false,
					use: false,
					// onScroll:true,
					page: {
						page: 0,
						size: 10
					}
				},
				// 下拉配置参数
				down: {
					auto: false,
					use: true
				},

				// 数据
				checkList: [],
				//消息为空时，显示的图片
				pic: "../../../../static/kongxiaoxi.png",
				picInfo: "消息空空如也",

				//当前页号
				current: 0,

				// 用于删除已处理消息
				orderStateName: "",
				orderStateId: 0
			}
		},
		// mounted() {
		// 	console.log(this.activeIndex);
		// 	console.log("tab-id"+this.tab[this.current].id);
		// 	this.requestData(this.tab[this.current].id);
		// },
		methods: {
			// 目前数据库里的账户 staff 15727631220 employee 17622737713 owner 11223344556，密码都是123456
			listChange(e) {
				// 滑动响应
				this.current = e.detail.current;
				this.$emit('change', this.current);
				
				console.log("tab-id"+this.tab[this.current].id);
				
				// test
				this.requestData(this.tab[this.current].id);
			},

			// mescroll 初始化组件
			initMeScroll(meScroll) {
				this.meScroll = meScroll
				console.log("init")
			},
			// 下拉回调
			downFn(meScroll) {
				console.log("下拉刷新了" + this.current);

				this.requestData(this.tab[this.current].id);
				meScroll.endSuccess();
			},

			//点击消息，根据消息状态进行处理
			async handleDel(e) {
				// console.log(e);
				await this.currentState(e);
				console.log(this.orderStateName);
				console.log(this.orderStateId);

				if (this.orderStateName !== e.orderStateName) {
					console.log("状态不符");
					uni.showToast({
						title: "消息已过期！正在删除...",
						icon: "none"
					});
				} else {
					console.log("跳转页面");
					this.NavigateToPage(e);
				}

				this.DeleteMsg(e);
				this.requestData(this.tab[this.current].id);
			},
			
			//根据具体情况跳转页面
			//1.海关页面  2.第三方页面  3.货主页面
			NavigateToPage(e){
				let loginType = utils.getLoginType();
				const data='?orderNumber='+e.orderNumber+'&orderStateId='+this.orderStateId;
				if(loginType == "staff"){
					if(this.tab[this.current].id == 1){
						uni.navigateTo({
							url: "/pages/staff/dispatch-detail/dispatch-detail"+data
						});
					}else if(this.tab[this.current].id == 2){
						uni.navigateTo({
							url: "/pages/staff/check-detail/check-detail"+data
						});
					}else if(this.tab[this.current].id == 3){
						uni.navigateTo({
							url: "/pages/staff/execute-detail/execute-detail"+data
						});
					}
				}else if(loginType == "employee"){
					if(this.tab[this.current].id == 4){
						uni.navigateTo({
							url: "/pages/employee/deadline-detail/deadline-detail"+data
						});
					}else if(this.tab[this.current].id == 5){
						uni.navigateTo({
							url: "/pages/employee/execute-detail/execute-detail"+data
						});
					}else if(this.tab[this.current].id == 6){
						if(this.orderStateId == 7){
							uni.navigateTo({
								url: "/pages/employee/check-detail/check-detail"+data
							});
						}else if(this.orderStateId == 8){
							uni.navigateTo({
								url: "/pages/employee/execute-detail/execute-detail"+data
							});
						}
					}
				}else if(loginType == "owner"){
					if(this.tab[this.current].id == 4){
						uni.navigateTo({
							url: "/pages/owner/deadline-detail/deadline-detail"+data
						});
					}else if(this.tab[this.current].id == 5){
						uni.navigateTo({
							url: "/pages/owner/execute-detail/execute-detail"+data
						});
					}else if(this.tab[this.current].id == 6){
						if(this.orderStateId == 7){
							uni.navigateTo({
								url: "/pages/owner/check-detail/check-detail"+data
							});
						}else if(this.orderStateId == 8){
							uni.navigateTo({
								url: "/pages/owner/execute-detail/execute-detail"+data
							});
						}
					}
				}
			},

			//根据消息体删除
			DeleteMsg(e) {
				console.log(e);
				this.$request.delete(
					this.$request.baseUrl + "/msg/remove?messageType=" + this.tab[this.current].id,
					e
				).then(result => {
					console.log(result);
				})
			},

			//根据报关单号查询当前状态
			async currentState(e) {
				const res = await this.$request.get(
					this.$request.baseUrl + "/order/select_by_ordernumber?orderNumber="+e.orderNumber
				)

				this.orderStateName = res.data.data.orderStateName;
				this.orderStateId = res.data.data.orderStateId;
			},

			//数据请求
			requestData(actIndex) {
				var _this = this;

				this.$request.get(
					this.$request.baseUrl + '/msg/get_msg?messageType='+actIndex
				).then(result => {
					console.log(result);
					_this.checkList = result.data.data;
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.message-swiper {
		// height: calc( 100vh - 182upx );
		height: 100%;

		.message-item {
			height: 100%;
			overflow: hidden;

			.me-scroll {
				.null-data{
					padding-top: 100rpx;
					height: 100%;
					.null-pic{
						display: flex;
						justify-content: center;
						align-items: center;
						image{
							width: 240rpx;
							height: 240rpx;
						}
					}
					.null-info{
						display: flex;
						justify-content: center;
						align-items: center;
						color: #6c6c6c;
						font-size: 30rpx;
					}
				}
			}
		}
	}
</style>
