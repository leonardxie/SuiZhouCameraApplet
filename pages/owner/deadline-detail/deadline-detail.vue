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
			</view>
			
			<!-- 超期提醒 弹框 -->
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
				modalName: 'Modal',
				//超期提醒信息
				deadline: '此单已超期！请尽快联系负责该单的第三方处理！'
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
