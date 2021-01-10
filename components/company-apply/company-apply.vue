<template>
	<view class="list-apply cu-list menu margin-tb-sm margin-left margin-right">
		<view class="cu-item">
			<view class="flex-sub radius text-grey">公司名称: <text class="text-black">{{item.companyName}}</text></view>
			<view class="flex-sub radius text-grey">负责人: <text class="text-black">{{item.employeeName}}</text></view>
		</view>
		<view class="cu-item">
			<view class="flex-sub radius text-grey">公司执行项目数: <text class="text-black">{{item.executeNumber}}</text></view>
			<view class="flex-sub radius text-grey">公司超期项目数: <text class="text-black">{{item.overdueNumber}}</text></view>
		</view>
		<view class="cu-item">
			<view class="flex-sub radius text-grey">联系方式: <text class="text-black">{{item.employeePhone}}</text></view>
			<view class="flex-sub radius text-grey margin-xs">
				<button class="cu-btn round line-blue"  style="left: 25%;" @click="chooseCompany">
					<text class="cuIcon-forward"></text> 确认派单</button>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		props: {
			index:{
				type:Number,
			},
			item: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		methods: {
			chooseCompany(){
				this.$emit('ChooseCompany',this.item);
			}
		},
		created() {}

	}
</script>

<style>

</style>
