<template>
	<view>
		<cu-custom bgColor="bg-theme-color" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">接单详细界面</block>
		</cu-custom>
		<view>
			<EntrustInformation :orderNumber='orderNumber'></EntrustInformation>
			<BasicInformation :orderNumber='orderNumber'></BasicInformation>
			<ShowDifferentTime :orderNumber='orderNumber'></ShowDifferentTime>
			<DispatchOtherFile :orderNumber='orderNumber'></DispatchOtherFile>
		</view>
	</view>
</template>

<script>
	import BasicInformation from '../../../components/basic-information/employee-basic-information.vue';
	import DispatchOtherFile from '../../../components/dispatch-otherfile/employee-dispatch-otherfile.vue';
	import ShowDifferentTime from '../../../components/show-different-time/employee-show-different-time.vue';

	export default {
		onLoad(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.orderNumber); //打印出上个页面传递的参数。
			console.log(option.orderStateId); //打印出上个页面传递的参数。
			this.orderNumber = option.orderNumber;
			this.orderStateId = option.orderStateId;
		},
		components: {
			BasicInformation,
			DispatchOtherFile,
			ShowDifferentTime,
		},
		data() {
			return {
				orderNumber: '',
				orderStateId: ''
			}
		},
		mounted() {},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.dispatch-swiper {
		height: 95vh;

		.swiper-item {
			height: 95%;
			overflow: hidden;
		}
	}
</style>
