<template>
	<view>
		<view>
			<cu-custom bgColor="bg-theme-color" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">执行详细界面</block>
			</cu-custom>
			<view>
				<EntrustInformation :orderNumber='orderNumber'></EntrustInformation>
				<BasicInformation :orderNumber='orderNumber'></BasicInformation>
				<ShowDifferentTime :orderNumber='orderNumber'></ShowDifferentTime>
				<ExecuteOtherFile :orderNumber='orderNumber'></ExecuteOtherFile>
				<!-- <view class="flex solid-bottom justify-center">
					<view class="padding-sm margin-xs radius">
						<button class="cu-btn bg-white" v-show="isJoin" @click="showJoinInfo">
							<text class="cuIcon-recordfill"></text>介入</button>
					</view>
					<view class="padding-sm margin-xs radius">
						<button class="cu-btn bg-white">
							<text class="cuIcon-attentionfill"></text>查看实验室监控</button>
					</view>
				</view> -->

			</view>
			<!-- 执行未通过 提醒弹框 -->
			<view class="cu-modal" :class="[modalName == 'Modal'?'show':'']">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">执行未通过!</view>
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

			<!-- 介入直播信息 弹框 -->
			<!-- <view class="cu-modal" :class="[modalName == 'DialogModal'?'show':'']">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">介入直播信息</view>
						<view class="action" @click="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						{{joinInfo}}
					</view>
					<view class="cu-bar bg-white justify-end">
						<view class="action">
							<button class="cu-btn line-green text-green" @click="hideModal">取消</button>
							<button class="cu-btn bg-green margin-left" @click="finishJoin">确定</button>
						</view>
					</view>
				</view>
			</view> -->
			<!-- 结束 -->

		</view>
	</view>
	</view>
</template>

<script>
	import EntrustInformation from '../../../components/entrust-information/entrust-information.vue';
	import BasicInformation from '../../../components/basic-information/basic-information.vue';
	import ExecuteOtherFile from '../../../components/execute-otherfile/execute-otherfile.vue';
	import ShowDifferentTime from '../../../components/show-different-time/show-different-time.vue';

	export default {
		onLoad(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.orderNumber); //打印出上个页面传递的参数。
			console.log(option.orderStateId); //打印出上个页面传递的参数。
			this.orderNumber = option.orderNumber;
			this.orderStateId = option.orderStateId;

			if (this.orderStateId != 3) {
				this.isJoin = false;
				if (this.orderStateId == 8) {
					this.getCheckInfo();
					this.modalName = 'Modal';
				}
			}
		},
		components: {
			EntrustInformation,
			BasicInformation,
			ExecuteOtherFile,
			ShowDifferentTime
		},
		data() {
			return {
				orderNumber: '',
				orderStateId: '',

				// 介入按钮的显示和隐藏
				isJoin: true,
				joinInfo: '',

				// 控制弹框显示和隐藏
				modalName: "",


				//海关审核未通过备注
				feedback: ''
			}
		},
		methods: {
			//请求执行未通过数据
			getCheckInfo() {
				this.$request.get(
					this.$request.baseUrl + '/exec_ord/last_check?orderNumber=' + this.orderNumber
				).then(result => {
					console.log(result);
					this.feedback = result.data.data.feedback;
				})
			},

			// 弹框隐藏
			hideModal(e) {
				this.modalName = null
			},

			//介入弹框事件
			// showJoinInfo() {
			// 	if (this.joinInfo == '') {
			// 		this.$request.get(
			// 			this.$request.baseUrl + '/exec_ord/intervene?orderNumber=' + this.orderNumber
			// 		).then(result => {
			// 			if (result.data.result == true) {
			// 				this.joinInfo = result.data.msg;
			// 			}
			// 		})
			// 	}

			// 	//弹框显示
			// 	this.modalName = 'DialogModal';
			// },

			// 完成介入
			// finishJoin() {
			// 	let Data = {
			// 		orderNumber: this.orderNumber
			// 	}

			// 	this.$request.put(
			// 		this.$request.baseUrl + '/exec_ord/intervened',
			// 		Data, {
			// 			header: {
			// 				'Content-Type': 'application/x-www-form-urlencoded'
			// 			}
			// 		}
			// 	).then(result => {
			// 		if(result.data.result == true){
			// 			uni.navigateBack();
			// 			uni.showToast({
			// 				title: '介入完成!',
			// 				icon: 'none',
			// 				duration: 3000
			// 			})
			// 		}else{
			// 			uni.showToast({
			// 				title: '介入失败!',
			// 				icon: 'none',
			// 				duration: 3000
			// 			})
			// 		}
			// 	}).catch(function() {
			// 		uni.showModal({
			// 			title: '错误',
			// 			content: `介入完成失败`,
			// 			showCancel: false
			// 		});
			// 	})
			// }
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
