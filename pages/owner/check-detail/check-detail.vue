<template>
	<view>
		<view>
			<cu-custom bgColor="bg-theme-color" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">审核详细界面</block>
			</cu-custom>
			<view>
				<EntrustInformation :orderNumber='orderNumber'></EntrustInformation>
				<BasicInformation :orderNumber='orderNumber'></BasicInformation>
				<ShowDifferentTime :orderNumber='orderNumber'></ShowDifferentTime>
				<CheckOtherFile :orderNumber='orderNumber'></CheckOtherFile>
				<!-- <view class="flex solid-bottom justify-center">
					<view class="padding-sm margin-xs radius">
						<button @click="modalName = 'DialogModal'" class="cu-btn bg-white" v-show="isShowCheck">
							<text class="cuIcon-writefill"></text>审核</button>
					</view> -->
				</view>

			</view>
			<!-- 重新提交材料-提醒弹框 -->
			<view class="cu-modal" :class="[modalName == 'Modal'?'show':'']">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">材料不全!</view>
						<view class="action" @click="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						{{feedback}}
					</view>
				</view>
			</view>
			<!-- 结束 -->

		</view>
	</view>
	</view>
</template>

<script>
	import EntrustInformation from '../../../components/entrust-information/entrust-information.vue';
	import BasicInformation from '../../../components/basic-information/basic-information.vue';
	import CheckOtherFile from '../../../components/check-otherfile/check-otherfile.vue';
	import ShowDifferentTime from '../../../components/show-different-time/show-different-time.vue';

	export default {
		onLoad(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.orderNumber); //打印出上个页面传递的参数。
			console.log(option.orderStateId); //打印出上个页面传递的参数。
			this.orderNumber = option.orderNumber;
			this.orderStateId = option.orderStateId;

			if (this.orderStateId != 6) {
				this.isShowCheck = false;
				if (this.orderStateId == 7) {
					this.getCheckInfo();
					this.modalName = 'Modal';
				}
			}
		},
		components: {
			EntrustInformation,
			BasicInformation,
			CheckOtherFile,
			ShowDifferentTime
		},
		data() {
			return {
				orderNumber: '',
				orderStateId: 0,

				//海关审核未通过备注
				feedback: '',
				// 控制审核按钮的显示和隐藏
				isShowCheck: true,

				// 控制弹框显示和隐藏
				modalName: "",

			}
		},
		methods: {
			//请求审核未通数据
			getCheckInfo() {
				this.$request.get(
					this.$request.baseUrl + '/exec_ord/last_check?orderNumber=' + this.orderNumber
				).then(result => {
					console.log(result);
					this.feedback = result.data.data.feedback;
				})
			},


			//弹框method
			//1.隐藏弹框
			hideModal(e) {
				this.modalName = null
			}
			
		}
	}
</script>

<style lang="scss">
	.dispatch-swiper {
		height: 100vh;

		.swiper-item {
			height: 100%;
			overflow: hidden;
		}
	}
</style>
