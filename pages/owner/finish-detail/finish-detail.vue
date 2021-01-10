<template>
	<view>
		<view>
			<cu-custom bgColor="bg-theme-color" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">完结详细界面</block>
			</cu-custom>
			<view>
				<EntrustInformation :orderNumber='orderNumber'></EntrustInformation>
				<BasicInformation :orderNumber='orderNumber'></BasicInformation>
				<ShowDifferentTime :orderNumber='orderNumber'></ShowDifferentTime>
				<FinishOtherFile :orderNumber='orderNumber'></FinishOtherFile>
				<view class="flex solid-bottom justify-center">
					<view class="padding-sm margin-xs radius">
						<button class="cu-btn bg-white" @click="showhistory">
							<text class="cuIcon-calendar"></text>查看审核详情</button>
					</view>
				</view>
			</view>
			<!-- 弹框，查看审核历史 -->
			<view class="cu-modal" :class="[modalName == 'Modal'?'show':'']">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">
							审核历史
						</view>
						<view class="action" @click="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						<view v-for="(item,index) in t_check_record" :key="index">
							<view class="flex">记录:{{index+1}}</view>	
							<view class="flex">
								<view class="flex-treble radius " style="text-align: left;">审核结果:{{item.isPass}}</view>
								<view class="flex-treble radius" style="text-align: left;">审核建议:{{item.checkOpinion}}</view>
							</view>
							<view class="flex">反馈时间:{{item.feedbackTime}}</view>
							<view class="flex margin-bottom">备注:{{item.feedBack}}</view>
						</view>
					</view>
					<view class="bg-white padding-sm">
						<button class="cu-btn round bg-grey" @click="hideModal">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import EntrustInformation from '../../../components/entrust-information/entrust-information.vue';
	import BasicInformation from '../../../components/basic-information/basic-information.vue';
	import FinishOtherFile from '../../../components/check-otherfile/check-otherfile.vue';
	import ShowDifferentTime from '../../../components/show-different-time/show-different-time.vue';

	export default {
		onLoad(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.orderNumber); //打印出上个页面传递的参数。
			console.log(option.orderStateId); //打印出上个页面传递的参数。
			this.orderNumber = option.orderNumber;
			this.orderStateId = option.orderStateId;
		},
		components: {
			EntrustInformation,
			BasicInformation,
			FinishOtherFile,
			ShowDifferentTime
		},
		data() {
			return {
				orderNumber: '',
				orderStateId: '',
				t_check_record: [],
				// 控制弹框显示和隐藏
				modalName: "",
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
			showhistory() {
				const _this = this;
				this.$request.get(
					this.$request.baseUrl + '/finished/all_check_record?orderNumber=' + this.orderNumber, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(function(response) {
					_this.t_check_record = response.data.data;
					console.log(_this.t_check_record);
					//对数据进行处理
					console.log(_this.t_check_record.length);
					for (let item of _this.t_check_record) {
						//审核结果 0通过1不通过
						if (item.isPass === 0) {
							item.isPass = '通过';
						} else {
							item.isPass = '不通过';
						}
						//审核意见   0:重新查验，1：重新提交材料（默认值为2）
						if (item.checkOpinion === 0) {
							item.checkOpinion = '重新查验';
						} else if (item.checkOpinion === 1) {
							item.checkOpinion = '重新提交材料';
						} else {
							item.checkOpinion = '通过'; //2是通过
						}
					}
					_this.modalName = 'Modal';
					console.log(_this.t_check_record);
				});
			},
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
