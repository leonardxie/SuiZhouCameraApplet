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
			<view class="flex solid-bottom justify-center">
				<view class="padding-sm margin-xs radius">
					<button class="cu-btn bg-white" @click="Apply">
						<text class="cuIcon-forward"></text>申请接单</button>
				</view>
			</view>
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
			Apply() { //确认申请按钮的相应函数
				const _this = this;
				// post请求
				let data = {
					orderNumber: _this.orderNumber
				}
				this.$request.post(
					this.$request.baseUrl + '/apply_ord/add_Apply', data, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).then(function(res) {
						uni.showToast({
							title: '申请成功!',
							duration: 2000
						});
						setTimeout(function() {
							uni.navigateBack({
								delta: 1,
								animationDuration: 1000
							})
						}, 2000)
				})
			},
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
