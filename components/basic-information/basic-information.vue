<template>
	<!-- wx20c95ccd9883e89f -->
	<view>
		<view class="cu-list menu">
			<view class="cu-item margin-top">
				<view class="flex-sub radius">报关单号：{{t_order.orderNumber}}</view>
				<view v-if="t_order.orderStateName=='已发布未派单'" class="flex-sub radius">状态: <text class="cu-tag light bg-yellow text-bold margin-left">{{t_order.orderStateName}}</text></view>
				<view v-if="t_order.orderStateName=='已派单未执行'" class="flex-sub radius">状态: <text class="cu-tag light bg-yellow text-bold margin-left">{{t_order.orderStateName}}</text></view>
				<view v-if="t_order.orderStateName=='已提交未审核'" class="flex-sub radius">状态: <text class="cu-tag light bg-yellow text-bold margin-left">{{t_order.orderStateName}}</text></view>
				<view v-if="t_order.orderStateName=='已执行未提交'" class="flex-sub radius">状态: <text class="cu-tag light bg-blue text-bold margin-left">{{t_order.orderStateName}}</text></view>
				<view v-if="t_order.orderStateName=='执行中'" class="flex-sub radius">状态: <text class="cu-tag light bg-blue text-bold margin-left">{{t_order.orderStateName}}</text></view>
				<view v-if="t_order.orderStateName=='超期'" class="flex-sub radius">状态: <text class="cu-tag light bg-red text-bold margin-left">{{t_order.orderStateName}}</text></view>
				<view v-if="t_order.orderStateName=='审核未通过'" class="flex-sub radius">状态: <text class="cu-tag light bg-red text-bold margin-left">{{t_order.orderStateName}}</text></view>
				<view v-if="t_order.orderStateName=='执行未通过'" class="flex-sub radius">状态: <text class="cu-tag light bg-red text-bold margin-left">{{t_order.orderStateName}}</text></view>
				<view v-if="t_order.orderStateName=='审核通过'" class="flex-sub radius">状态: <text class="cu-tag light bg-green text-bold margin-left">{{t_order.orderStateName}}</text></view>
			</view>
			<view class="cu-item">
				<view class="flex-sub radius">项目名称：{{t_order.orderName}}</view>
				<view class="flex-sub radius">类别：{{t_order.goodClass}}</view>
			</view>
			<view class="cu-item">
				<view class="flex-sub radius">货主：{{t_order.ownerName}}</view>
				<view class="flex-sub radius">联系方式：{{t_order.ownerPhone}}</view>
			</view>
			<view class="cu-item margin-top">
				<view class="flex-sub radius">关别：{{t_staff.customsName}}</view>
				<view class="flex-sub radius">处室：{{t_staff.officeName}}</view>
			</view>
			<view class="cu-item">
				<view class="flex-sub radius">科室：{{t_staff.departmentName}}</view>
			</view>
			<view class="cu-item">
				<view class="flex-sub radius">委托人：{{t_staff.staffName}}</view>
				<view class="flex-sub radius">联系方式：{{t_staff.phone}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				t_order: [],
				t_staff: []
			}
		},
		props: [
			'orderNumber'
		],
		methods: {
			getData() {
				const _this = this;
				this.$request.get(
					this.$request.baseUrl + '/order/select_by_ordernumber?orderNumber=' + this.orderNumber, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(function(res) {
					_this.t_order = res.data.data;
					//嵌套子查询，查询海关科员信息
					_this.$request.get(
						_this.$request.baseUrl + '/public/get_staff?staffId=' + _this.t_order.staffId, {
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}
					).then(function(res) {
						_this.t_staff = res.data.data;
					});
				});
			}
		},
		mounted(){
			this.getData();
		}
	}
</script>

<style>

</style>
