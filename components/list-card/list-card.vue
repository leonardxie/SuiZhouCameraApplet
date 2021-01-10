<template>
	<view :class="[isSearch ? 'listcard-search' : 'listcard']" @click="open">
		<view class="content">
			<view class="title text-black">报关单名称 : <text class="text-grey">{{item.orderName}}</text></view>
			<view class="number text-black">报关单号 : <text class="text-grey">{{item.orderNumber}}</text></view>
			<view class="time text-black">时间 : <text class="text-grey">{{item.updateTime}}</text></view>
			<view v-if="item.orderStateName=='已发布未派单'" class="state text-black">执行状态 : <text class="text-yellow text-bold">{{item.orderStateName}}</text></view>
			<view v-if="item.orderStateName=='已派单未执行'" class="state text-black">执行状态 : <text class="text-yellow text-bold">{{item.orderStateName}}</text></view>
			<view v-if="item.orderStateName=='已提交未审核'" class="state text-black">执行状态 : <text class="text-yellow text-bold">{{item.orderStateName}}</text></view>
			<view v-if="item.orderStateName=='已执行未提交'" class="state text-black">执行状态 : <text class="text-blue text-bold">{{item.orderStateName}}</text></view>
			<view v-if="item.orderStateName=='执行中'" class="state text-black">执行状态 : <text class="text-blue text-bold">{{item.orderStateName}}</text></view>
			<view v-if="item.orderStateName=='超期'" class="state text-black">执行状态 : <text class="text-red text-bold">{{item.orderStateName}}</text></view>
			<view v-if="item.orderStateName=='审核未通过'" class="state text-black">执行状态 : <text class="text-red text-bold">{{item.orderStateName}}</text></view>
			<view v-if="item.orderStateName=='执行未通过'" class="state text-black">执行状态 : <text class="text-red text-bold">{{item.orderStateName}}</text></view>
			<view v-if="item.orderStateName=='审核通过'" class="state text-black">执行状态 : <text class="text-green text-bold">{{item.orderStateName}}</text></view>
		</view>
	</view>
</template>
<script>
	import utils from '../../utils/utils.js';
	
	export default {
		props: {
			isSearch: {
				type: Boolean,
				default: false
			},
			index: {
				type: Number,
			},
			item: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {};
		},
		onReady() {
			console.log(this.isSearch)
		},
		methods: {
			open() {
				console.log("点击");
				console.log(this.index);
				this.$emit('click', this.item);
				uni.setStorage('selected_order', this.item);
				const data = '?orderNumber=' + this.item.orderNumber + '&orderStateId=' + this.item.orderStateId;
				console.log(data);
				console.log(utils.getUserId());
				if(utils.getLoginType()==='staff'){//当前为海关人员的话
					//接单界面的操作
					if(this.index==0){
						uni.navigateTo({
							url: '/pages/staff/dispatch-detail/dispatch-detail'+data
						})
					}else if(this.index==1){
						uni.navigateTo({
							url:'/pages/staff/execute-detail/execute-detail'+data
						})
					}else if(this.index==2){
						uni.navigateTo({
							url:'/pages/staff/check-detail/check-detail'+data
						})
					}else if(this.index==3){
						uni.navigateTo({
							url:'/pages/staff/finish-detail/finish-detail'+data
						})
					}else{
						uni.navigateTo({
							url:'/pages/staff/deadline-detail/deadline-detail'+data
						})
					}
				}
				else if(utils.getLoginType()==='employee'){
					if(this.index==0){
						uni.navigateTo({
							url: '/pages/employee/receive-detail/receive-detail'+data
						})
					}else if(this.index==1){
						uni.navigateTo({
							url:'/pages/employee/execute-detail/execute-detail'+data
						})
					}else if(this.index==2){
						uni.navigateTo({
							url:'/pages/employee/submit-detail/submit-detail'+data
						})
					}else if(this.index==3){
						uni.navigateTo({
							url:'/pages/employee/finish-detail/finish-detail'+data
						})
					}else{
						uni.navigateTo({
							url:'/pages/employee/deadline-detail/deadline-detail'+data
						})
					}
				}else if(utils.getLoginType()==='owner'){//当前为海关人员的话
					//接单界面的操作
					if(this.index==0){
						uni.navigateTo({
							url: '/pages/owner/dispatch-detail/dispatch-detail'+data
						})
					}else if(this.index==1){
						uni.navigateTo({
							url:'/pages/owner/execute-detail/execute-detail'+data
						})
					}else if(this.index==2){
						uni.navigateTo({
							url:'/pages/owner/check-detail/check-detail'+data
						})
					}else if(this.index==3){
						uni.navigateTo({
							url:'/pages/owner/finish-detail/finish-detail'+data
						})
					}else{
						uni.navigateTo({
							url:'/pages/owner/deadline-detail/deadline-detail'+data
						})
					}
				}
				
			}
		},
	}
</script>

<style lang="scss">
	.listcard {
		display: flex;
		background-color: #ffffff;
		padding: 25rpx;
		margin: 4rpx;
		border-radius: 12rpx;
		box-shadow: 0 0 10rpx 2rpx rgba($color: #000000, $alpha: 0.1);
		box-sizing: border-box;
	}

	.listcard-search {
		display: flex;
		position: relative;
		background-color: #ffffff;
		padding: 25rpx 0 20rpx 0;
		box-sizing: border-box;
		
		&::before {
			content: '';
			position: absolute;
			left: 4%;
			bottom: 0;
			top: auto;
			right: auto;
			height: 2rpx;
			width: 96%;
			background-color: #c1c7cc;
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		padding-left: 40rpx;
		width: 100%;

		.title {
			font-size: 30rpx;
		}

		.number {
			font-size: 30rpx;
		}

		.state {
			font-size: 30rpx;
		}
	}
</style>
