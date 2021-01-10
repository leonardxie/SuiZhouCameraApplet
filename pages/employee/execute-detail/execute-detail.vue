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
				<ExecuteOtherFile :orderNumber='orderNumber' @updateEntrustFileStatus="justCommit"></ExecuteOtherFile>
				<view class="flex solid-bottom justify-center">
					<view class="padding-sm margin-xs radius">
						<button class="cu-btn bg-white" v-show="isJoin" @click="modalName = 'JoinModal'">
							<text class="cuIcon-recordfill"></text>介入通知</button>
					</view>
					<view class="padding-sm margin-xs radius">
						<button class="cu-btn bg-white" v-show="isDoIt" @click="DoItAction">
							<text class="cuIcon-attentionfill"></text>{{DoIt}}</button>
					</view>
				</view>

			</view>
			<!-- 执行未通过弹框 -->
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

			<!-- 开始执行前 弹框 开始 -->
			<view class="cu-modal" :class="[modalName == 'AttentionModal'?'show':'']">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">准备开始!</view>
						<view class="action" @click="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						{{attentionTip}}
					</view>
				</view>
			</view>
			<!-- 开始执行前 弹框 结束 -->

			<!-- 介入通知弹框 开始 -->
			<view class="cu-modal" :class="[modalName == 'JoinModal'?'show':'']">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">发送介入直播信息</view>
						<view class="action" @click="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						<form>
							<view class="cu-form-group margin-top">
								<textarea maxlength="-1" :disabled="textAreaShow!=null" v-model="textareaAInput" placeholder="请输入直播信息"></textarea>
							</view>
						</form>
					</view>
					<view class="cu-bar bg-white justify-end">
						<view class="action">
							<button class="cu-btn line-green text-green" @click="hideModal">取消</button>
							<button class="cu-btn bg-green margin-left" @click="InfoPost">通知海关</button>
						</view>
					</view>
				</view>
			</view>
			<!-- 介入通知弹框 结束 -->

		</view>
	</view>
	</view>
</template>

<script>
	import EntrustInformation from '../../../components/entrust-information/entrust-information.vue';
	import BasicInformation from '../../../components/basic-information/basic-information.vue';
	import ExecuteOtherFile from '../../../components/execute-otherfile/employee-execute-otherfile.vue';
	import ShowDifferentTime from '../../../components/show-different-time/show-different-time.vue';

	export default {
		onLoad(option) { //option为object类型，会序列化上个页面传递的参数
			setTimeout(function() {
				console.log('start pulldown');
			}, 1000);

			console.log(option.orderNumber); //打印出上个页面传递的参数。
			console.log(option.orderStateId); //打印出上个页面传递的参数。
			this.orderNumber = option.orderNumber;
			this.orderStateId = option.orderStateId;

			this.controlByState();
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

				// 控制弹框显示和隐藏
				// modalName == Modal:执行未通过提醒
				// modalName == AttentionModal:未执行通知
				// modalName == JoinModal:发送介入信息弹框
				modalName: "",

				//开始执行前的提醒事项
				attentionTip: '请先上传委托单！否则无法开始执行',

				//是否显示介入按钮  orderStateId == 3
				isJoin: true,
				//开始执行 or 执行完成
				isDoIt: false,
				//DoIt == '开始执行' or '执行完成'
				DoIt: '开始执行',

				//海关审核未通过备注
				feedback: '',

				//介入直播信息data
				textAreaShow: null,
				textareaAInput: ''
			}
		},
		methods: {
			//根据状态进行控制
			//注意 === 和 ==
			controlByState() {
				if (this.orderStateId == 3) {
					this.DoIt = '执行完成';
					this.isDoIt = true;
				} else {
					this.isJoin = false;

					if (this.orderStateId == 8) {
						this.getCheckInfo();
						this.modalName = 'Modal';
						this.isDoIt = true;
					} else {
						this.controlStart();
					}
				}
			},

			//判断是否已上传委托单，从而控制开始执行按钮的显示和隐藏
			controlStart() {
				this.$request.get(
					this.$request.baseUrl + "/order/select_by_ordernumber?orderNumber=" + this.orderNumber
				).then(res => {
					if (res.data.result === true) {
						if (res.data.data.entrustFileDir == null ||
							res.data.data.entrustFileDir === "") {
							this.isDoIt = false;
							this.modalName = 'AttentionModal';
						} else {
							this.isDoIt = true;
							this.modalName = null;
						}
					}
				}).catch(err => {
					console.log(err)
				})
			},

			DoItAction() {
				if (this.DoIt === '执行完成') {
					this.finishAction();
				} else {
					this.startAction();
				}
			},

			//开始执行接口
			startAction() {
				let Data = {
					orderNumber: this.orderNumber
				}
				this.$request.put(
					this.$request.baseUrl + '/exec_ord/start_exec',
					Data, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(res => {
					if (res.data.result === true) {
						this.DoIt = '执行完成';
						this.isJoin = true;
						this.orderStateId = 3;
					}
				}).catch(err => {
					console.log(err);
				})
			},

			// 发送直播信息,通知海关
			InfoPost() {
				if (this.textareaAInput == '') {
					uni.showModal({
						title: '提示',
						content: `你不开口，海关是无法了解你心意的！`,
						showCancel: false
					})
				} else {
					let Data = {
						interveneInfo: this.textareaAInput,
						orderNumber: this.orderNumber
					}

					this.$request.put(
						this.$request.baseUrl + '/exec_ord/set_liveinfo',
						Data, {
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}
					).then(res => {
						if(res.data.result === true){
							this.modalName = null;
							uni.showModal({
								title: '成功',
								content: `你的心意已传达给海关！`,
								showCancel: false
							})
						}
					}).catch(err => {
						console.log(err);
					})
				}
			},

			//执行完成
			finishAction() {
				let Data = {
					orderNumber: this.orderNumber
				}

				this.$request.put(
					this.$request.baseUrl + '/exec_ord/finish',
					Data, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(res => {
					if (res.data.result === true) {
						uni.navigateBack();
						uni.showToast({
							title: '执行完成!请及时提交材料',
							icon: 'none',
							duration: 3000
						})
					}
				}).catch(err => {
					console.log(err);
				})

			},

			//请求执行未通过数据
			getCheckInfo() {
				this.$request.get(
					this.$request.baseUrl + '/exec_ord/last_check?orderNumber=' + this.orderNumber
				).then(result => {
					console.log(result);
					this.feedback = result.data.data.feedback;
				})
			},
			hideModal(e) {
				this.modalName = null
			},
			justCommit: function(filename = '') {
				console.log("hello");

				let page = getCurrentPages().pop(); //跳转页面成功之后
				console.log(page.$page.fullPath);
				uni.redirectTo({
					url: page.$page.fullPath
				})
				// if (!page) return;
				// page.onLoad(); //如果页面存在，则重新刷新页面
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
