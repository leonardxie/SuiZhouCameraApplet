<template>
	<view class="cu-list menu margin-top">
		<view class="cu-item">
			<view class="title">期望完成时间：{{t_order.deadlineTime}}</view>
		</view>
		<view class="cu-item " v-if="t_order.orderStateId==1">
			<view class="title">发单时间：{{t_order.distributeTime}}</view>
		</view>
		<view class="cu-item" 
		v-if="t_order.orderStateId==2||t_order.orderStateId==5">
			<view class="title">接单时间：{{t_order.receiveTime}}</view>
		</view>
		<view class="cu-item" 
		v-if="t_order.orderStateId==3||t_order.orderStateId==4">
			<view class="title">执行时间：{{t_order.executeTime}}</view>
		</view>
		<view class="cu-item" v-if="t_order.orderStateId==6">
			<view class="title">提交时间：{{t_order.submitTime}}</view>
		</view>
		<view class="cu-item" 
		v-if="t_order.orderStateId==7||t_order.orderStateId==8">
			<view class="title">审核时间：{{t_order.feedbackTime}}</view>
		</view>
		<view class="cu-item" v-if="t_order.orderStateId==9">
			<view class="title">完结时间：{{t_order.endTime}}</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				t_order: [],
			}
		},
		props: [
			"orderNumber"
		],
		mounted(){
			this.getData();
		},
		methods: {
			getData(){
				const _this = this;
				this.$request.get(
					this.$request.baseUrl + '/apply_ord/select_by_ordernumber?orderNumber=' + this.orderNumber, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(function(res) {
					_this.t_order = res.data.data;
				});
			}
		}
	}
</script>

<style>

</style>
