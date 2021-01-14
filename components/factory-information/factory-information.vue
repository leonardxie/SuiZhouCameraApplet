<template>
	<view>
		
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="flex-sub radius">车厂信息</view>
			</view>
			
			<view class="cu-item">
				<view class="flex-sub radius">车厂编号：{{t_order.orderNumber}}</view>
				<view  class="flex-sub radius">车厂名称: 
					<text class="cu-tag light bg-yellow text-bold margin-left">{{t_order.orderStateName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="flex-sub radius">联系方式：{{t_order.orderName}}</view>
				<view class="flex-sub radius">管理员姓名：{{t_order.goodClass}}</view>
			</view>
			<view class="cu-item">
				<view class="flex-sub radius">车厂简介：{{t_order.ownerName}}</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				t_order:{
					orderName:1,
					
				}
			};
		}
	}
</script>

<style>

</style>
