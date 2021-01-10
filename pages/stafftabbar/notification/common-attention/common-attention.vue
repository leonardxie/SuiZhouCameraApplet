<template>
	<view>
		<!-- 列表 开始 -->
		<view class="list">
			<!-- 标题 -->
			<view class="list-title">
				<view class="list-icon" @click="myTest">
					<uni-icons :type="page.pageIcon" size="24" color="#368dff"></uni-icons>
				</view>
				<view class="list-name">
					{{page.name}}列表
				</view>
			</view>

			<!-- 详细列表 -->
			<view class="the-list">
				<view class="list-item" v-for="(item,index) in commonList" :key="index" @click="handleMsg(item)">
					<view class="item-pic">
						<uni-icons type="email" size="34" color="#fff"></uni-icons>
					</view>
					<view class="item-info">
						<view class="item-status">报关单号：{{item.orderNumber}}</view>
						<view class="item-name">报关项目：{{item.orderName}}</view>
						<view class="item-company">第三方公司：{{item.companyName}}</view>
						<view class="item-time">{{item.createTime}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 列表 结束 -->

		<view class="message-bottom">
			<view>---我是有底线的!---</view>
		</view>

	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	export default {
		components: {
			uniIcons
		},
		props: {
			checkList: Array,
			scrollViewHeight: Number,
			current: Number
		},
		data() {
			return {
				//页面信息
				page: {
					name: "",
					pageIcon: "",
					pageId: 999
				}
			}
		},
		computed: {
			commonList: function() {
				return this.checkList;
			},
			titleIcon: function(){
				if(this.current === 1){
					this.page.name = "已接单";
					this.page.pageIcon = "personadd";
				}else if(this.current === 2){
					this.page.name = "待审核";
					this.page.pageIcon = "compose";
				}else if(this.current === 3){
					this.page.name = "请求";
					this.page.pageIcon = "phone";
				}else if(this.current === 4){
					this.page.name = "超期";
					this.page.pageIcon = "help";
				}else if(this.current === 5){
					this.page.name = "接单";
					this.page.pageIcon = "checkbox";
				}else if(this.current === 6){
					this.page.name = "未通过审核";
					this.page.pageIcon = "close";
				}
				
				this.page.pageId = this.current;
			}
		},
		methods: {
			// 处理消息
			// 1.如果该消息已过期(状态已改变),删除消息,刷新列表
			// 2.如果该消息未过期,跳转至相应详情页,并删除该消息
			handleMsg(e){
				console.log(e);
				this.$emit("delItem",e);
			},

			myTest() {
				this.commonList = this.checkList;
			}
		}
	}
</script>

<style lang="scss" scoped>
	// .msg-title{
	// 	padding: 20rpx;
	// 	color: #ccc;
	// 	font-size: 28rpx;
	// 	font-weight: 600;
	// 	border-bottom: 5rpx solid #eee;
	// }

	//通知列表(待审核,已接单)
	.list {
		// height: calc(100vh - 182rpx);
		// height: 100%;
		padding: 10rpx;

		.list-title {
			padding: 10rpx 0;
			display: flex;
			align-items: center;

			.list-icon {
				padding-left: 25rpx;
			}

			.list-name {
				// padding-top: 6rpx;
				margin-left: 20rpx;
			}
		}

		.the-list {
			.list-item {
				background: #fff;
				padding: 20rpx 10rpx;
				display: flex;
				border-bottom: 5rpx solid #eee;
				align-items: center;

				.item-pic {
					width: 100rpx;
					height: 100rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 50%;
					background: #368dff;
				}

				.item-info {
					padding-left: 15rpx;
					font-size: 24rpx;
					flex: 1;

					.item-status {}

					.item-name {
						padding: 5rpx 0;
					}

					.item-company {}
					
					.item-time{
						padding-top: 5rpx;
						color: #6c6c6c;
					}
				}
			}
		}
	}

	.message-bottom {
		view {
			width: 32%;
			margin: 0 auto;
			color: #6c6c6c;
		}
	}
</style>
