<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" isBack="true">
			<view slot="backText">返回</view>
			<view slot="content">测试重新加载</view>
		</cu-custom>
		<view>
			<button @click="Goto">跳转</button>
		</view>
		<view>
			{{data}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: 1
			}
		},
		onLoad() {
			this.data += this.data;
		},
		methods: {
			Goto(){
				uni.navigateTo({
					url: '/pages/stafftabbar/notification/test'
				})
			}
		}
	}
</script>

<style>

</style>
