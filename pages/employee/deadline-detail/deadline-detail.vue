<template>
	<view>
		<view>
			<cu-custom bgColor="bg-theme-color" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">超期详细界面</block>
			</cu-custom>
			<view class="margin-bottom">
				<EntrustInformation :orderNumber='orderNumber'></EntrustInformation>
				<BasicInformation :orderNumber='orderNumber'></BasicInformation>
				<ShowDifferentTime :orderNumber='orderNumber'></ShowDifferentTime>
				<DeadlineOtherFile :orderNumber='orderNumber'></DeadlineOtherFile>
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
			
			<!-- 超期提醒 开始 -->
			<view class="cu-modal" :class="[modalName == 'Modal'?'show':'']">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">超期提醒!</view>
						<view class="action" @click="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						{{deadline}}
					</view>
				</view>
			</view>
			<!-- 超期提醒 结束 -->
			
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
	import DeadlineOtherFile from '../../../components/execute-otherfile/execute-otherfile.vue'; 
	import ShowDifferentTime from '../../../components/show-different-time/show-different-time.vue';

	export default {
		onLoad(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.orderNumber); //打印出上个页面传递的参数。
			console.log(option.orderStateId); //打印出上个页面传递的参数。
			this.orderNumber = option.orderNumber;
			this.orderStateId = option.orderStateId;
			
			this.controlStart();
		},
		components: {
			EntrustInformation,
			BasicInformation,
			DeadlineOtherFile,
			ShowDifferentTime
		},
		data() {
			return {
				orderNumber: '',
				orderStateId:'',
				
				//控制弹框的显示和隐藏
				// 默认Modal,即超期提醒弹框显示
				modalName: 'Modal',
				
				//超期提醒信息
				deadline: '1.该单已超期，请尽快处理；2.上传委托单后方可开始处理。',
				
				//控制介入按钮的显示和隐藏
				isJoin: false,
				//控制开始执行按钮的情况
				isDoIt: false,
				//DoItAction == 立即执行 or 执行完成
				DoIt: '立即执行',
				
				//介入直播信息data
				textAreaShow: null,
				textareaAInput: ''
				
			}
		},
		methods: {
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				console.log(this.TabCur);

			},
			SwiperChange(e) {
				const current = e.detail.current
				console.log(current + 'hello');
				this.TabCur = e.currentTarget.dataset.id;
			},
			
			//判断是否已上传委托单，从而控制执行按钮的显示和隐藏
			controlStart(){
				this.$request.get(
					this.$request.baseUrl + "/order/select_by_ordernumber?orderNumber=" + this.orderNumber
				).then(res => {
					if (res.data.result === true) {
						if (res.data.data.entrustFileDir == null ||
							res.data.data.entrustFileDir === "") {
							this.isDoIt = false;
						} else {
							this.isDoIt = true;
						}
					}
				}).catch(err => {
					console.log(err)
				})
			},
			
			//执行
			DoItAction(){
				if(this.DoIt != '立即执行'){
					this.finishAction();
				}else{
					this.startAction();
				}
			},
			
			//立即执行接口
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
