<template>
	<view>
		<cu-custom bgColor="bg-theme-color" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">派单</block>
		</cu-custom>
		<scroll-view scroll-x class="bg-white nav text-center">
			<view class="cu-item" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tabText" :key="index" @tap="tabSelect"
			 :data-id="index">
				{{item}}
			</view>
		</scroll-view>
		<swiper class="dispatch-swiper margin-bottom" :current="TabCur" @change="SwiperChange">
			<swiper-item class="swiper-item">
				<BasicInformation :orderNumber='orderNumber'></BasicInformation>
				<ShowDifferentTime :orderNumber='orderNumber'></ShowDifferentTime>
				<DispatchOtherFile :orderNumber='orderNumber'></DispatchOtherFile>
			</swiper-item>
			<swiper-item>
				<CompanyApply :item="item" :index="index" v-for="(item,index) in applyTable" v-on:ChooseCompany="ChooseCompany"></CompanyApply>
			</swiper-item>
		</swiper>

		<!-- <view v-if="TabCur==0">
			<EntrustInformation></EntrustInformation>
			<BasicInformation></BasicInformation>
			<ShowDifferentTime></ShowDifferentTime>
			<DispatchOtherFile></DispatchOtherFile>
		</view>
		<view v-if="TabCur==1">
			<DispatchOtherFile></DispatchOtherFile>
			<view class="upload">
				<button class="cu-btn block margin-tb-sm lg upload-button">
				<text class="cuIcon-forward"></text> 确认派单</button>
			</view>
		</view> -->
	</view>
</template>

<script>
	import BasicInformation from '../../../components/basic-information/basic-information.vue';
	import DispatchOtherFile from '../../../components/dispatch-otherfile/dispatch-otherfile.vue';
	import ShowDifferentTime from '../../../components/show-different-time/show-different-time.vue';
	import CompanyApply from '../../../components/company-apply/company-apply.vue';
	import utils from '../../../utils/utils.js';

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
			CompanyApply,
		},
		data() {
			return {
				tabText: ['项目信息', '第三方预接单'],
				TabCur: 1,
				applyTable: [],
				orderNumber: '',
				orderStateId: ''
			}
		},
		mounted() {
			this.getApplyList();
		},
		methods: {
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
			},
			SwiperChange(e) {
				const current = e.detail.current
				this.TabCur = current;
			},
			getApplyList() {
				const _this = this;
				this.$request.get(
					this.$request.baseUrl + '/dist_ord/company_apply?orderNumber=' + this.orderNumber, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(function(res) {
					_this.applyTable = res.data.data;
					if (_this.applyTable == '') {
						uni.showToast({
							title: '暂无公司申请',
							icon: 'none',
							duration: 1500
						})
					}
					console.log(res);
				});
			},
			ChooseCompany(val) {
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
						console.log(val);
						let data = {
							companyId: val.companyId,
							orderNumber: this.orderNumber
						};
						console.log(data);
						this.$request.post(
							this.$request.baseUrl + '/dist_ord/receive_apply',
							data, {
								header: {
									'Content-Type': 'application/x-www-form-urlencoded'
								}
							}
						).then(function(res) {
							uni.showToast({
								title: '派单成功!',
								duration: 2000
							});
							setTimeout(function() {
								uni.navigateBack({
									delta: 1,
									animationDuration: 1000
								})
							}, 2000);
						});
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
