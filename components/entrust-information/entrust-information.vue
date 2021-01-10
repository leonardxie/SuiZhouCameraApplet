<template>
	<view class="cu-list menu">
		<view class="cu-item margin-top">
			<view class="flex-sub radius">第三方公司：{{t_order.companyName}}</view>
		</view>
		<view class="cu-item">
			<view class="flex-sub radius">负责人：{{t_order.employeeName}}</view>
			<view class="flex-sub radius">联系方式：{{t_order.employeePhone}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				t_order: [],
			};
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
