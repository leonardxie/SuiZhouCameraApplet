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
				<view class="flex solid-bottom justify-center">
					<view class="padding-sm margin-xs radius">
						<button @click="executecheck" class="cu-btn bg-white" v-show="isShowCheck">
							<text class="cuIcon-writefill"></text>审核</button>
					</view>
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

			<!-- 审核弹窗 开始 -->
			<view class="cu-modal" :class="[modalName == 'DialogModal'?'show':'']">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">开始审核</view>
						<view class="action" @click="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						<form>
							<view class="cu-form-group margin-top">
								<view class="title">审核结果</view>
								<picker mode='selector' @change="resPickerChange" :range="resPicker" :range-key="'name'">
									<label class="" style="font-size: 120%;">{{resPicker[resIndex].name}}</label>
								</picker>
							</view>
							<view class="cu-form-group margin-top">
								<view class="title">审核建议</view>
								<picker mode='selector' @change="sugPickerChange" :range="sugPicker" :range-key="'name'">
									<label class="" style="font-size: 120%;">{{sugPicker[sugIndex].name}}</label>
								</picker>
							</view>
							<view class="cu-form-group margin-top">
								<textarea maxlength="-1" :disabled="textAreaShow!=null" v-model="textareaAInput" placeholder="简述原因(审核未通过必填;审核通过可略)"></textarea>
							</view>
						</form>
					</view>
					<view class="cu-bar bg-white justify-end">
						<view class="action">
							<button class="cu-btn line-green text-green" @click="hideModal">取消</button>
							<button class="cu-btn bg-green margin-left" @click="testPost">确定</button>
						</view>
					</view>
				</view>
			</view>
			<!-- 审核弹窗 结束 -->

		</view>
	</view>
	</view>
</template>

<script>
	import EntrustInformation from '../../../components/entrust-information/entrust-information.vue';
	import BasicInformation from '../../../components/basic-information/basic-information.vue';
	import CheckOtherFile from '../../../components/check-otherfile/check-otherfile.vue';
	import ShowDifferentTime from '../../../components/show-different-time/show-different-time.vue';
	import utils from '../../../utils/utils.js'

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

				//审核弹框所需data
				//1.审核结果data
				resIndex: 0,
				resPicker: [{
						label: 0,
						name: '审核通过'
					},
					{
						label: 1,
						name: '审核未通过'
					}
				],
				//2.审核建议data
				sugIndex: 0,
				sugPicker: [{
						label: 2,
						name: '无'
					},
					{
						label: 0,
						name: '重新查验'
					},
					{
						label: 1,
						name: '重新提交材料'
					}
				],
				//3.文本框data
				textAreaShow: null,
				textareaAInput: ''

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
			executecheck(){
				const _this = this;
				this.$request.get(
					this.$request.baseUrl + '/order/select_by_ordernumber?orderNumber=' + this.orderNumber, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(function(res) {
					_this.t_order = res.data.data;
					if (utils.getUserId() === _this.t_order.staffId) {
						modalName = 'DialogModal';
					} else {
						uni.showToast({
							title: '此单不由你负责',
							duration: 2000,
							icon:'none'
						});
						setTimeout(function() {
							uni.navigateBack({
								delta: 1,
								animationDuration: 1000
							})
						}, 2000);
					}
				});
			},

			//弹框method
			//1.隐藏弹框
			hideModal(e) {
				this.modalName = null
			},
			//2.控制审核结果的data
			resPickerChange(e) {
				console.log(e);
				this.resIndex = e.detail.value;
			},
			//3.控制审核建议的data
			sugPickerChange(e) {
				this.sugIndex = e.detail.value;
			},
			//提交
			testPost() {
				let resLabel = this.resPicker[this.resIndex].label;
				let sugLabel = this.sugPicker[this.sugIndex].label;
				let reasonInfo = this.textareaAInput;

				if ((resLabel == 0 && (sugLabel == 0 || sugLabel == 1)) || (resLabel == 1 && sugLabel == 2)) {
					uni.showToast({
						title: '结果和建议不符!',
						icon: 'none',
						duration: 2000
					})
				} else if (resLabel == 1 && reasonInfo == '') {
					uni.showToast({
						title: '请简述退回原因!',
						icon: 'none',
						duration: 2000
					})
				} else {
					let Data = {
						checkOpinion: sugLabel,
						feedback: reasonInfo,
						isPass: resLabel,
						orderNumber: this.orderNumber
					};

					this.$request.post(
						this.$request.baseUrl+'/examine_ord/check_order',
						Data, {
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}
					).then(res => {
						console.log(res);
						if (res.data.result == true) {
							uni.navigateBack();
							if(sugLabel == 2){
								uni.showToast({
									title: '审核成功!通过-->完结列表',
									duration: 3000
								})
							}else if(sugLabel == 0){
								uni.showToast({
									title: '审核成功!重新查验-->执行列表',
									duration: 3000
								})
							}else if(sugLabel == 1){
								uni.showToast({
									title: '审核成功!重新提交材料-->审核列表',
									duration: 3000
								})
							}
						} else {
							alert("审核提交失败！");
						}
					}).catch(function() {
						uni.showModal({
							title: '错误',
							content: `审核提交失败`,
							showCancel: false
						});
					})
				}
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
