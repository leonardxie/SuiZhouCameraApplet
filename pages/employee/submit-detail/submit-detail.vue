<template>
	<view>
		<view>
			<cu-custom bgColor="bg-theme-color" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">提交详细界面</block>
			</cu-custom>
			<view>
				<EntrustInformation :orderNumber='orderNumber'></EntrustInformation>
				<BasicInformation :orderNumber='orderNumber'></BasicInformation>
				<ShowDifferentTime :orderNumber='orderNumber'></ShowDifferentTime>
				<SubmitOtherFile :orderNumber='orderNumber' :orderStateId='orderStateId' @updateFileStatus="justCommit"></SubmitOtherFile>
			</view>
			<!-- 弹框 -->
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
		</view>
	</view>
	</view>
</template>

<script>
	import EntrustInformation from '../../../components/entrust-information/entrust-information.vue';
	import BasicInformation from '../../../components/basic-information/basic-information.vue';
	import SubmitOtherFile from '../../../components/submit-otherfile/employee-submit-otherfile.vue';
	import ShowDifferentTime from '../../../components/show-different-time/show-different-time.vue';

	export default {
		onLoad(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.orderNumber); //打印出上个页面传递的参数。
			console.log(option.orderStateId); //打印出上个页面传递的参数。
			this.orderNumber = option.orderNumber;
			this.orderStateId = option.orderStateId;
			
			if(this.orderStateId == 7){
				this.getCheckInfo();
				this.modalName = 'Modal';
			}
		},
		components: {
			EntrustInformation,
			BasicInformation,
			SubmitOtherFile,
			ShowDifferentTime
		},
		data() {
			return {
				orderNumber:'',
				orderStateId: 0,				
				// 控制弹框显示和隐藏
				modalName: "",
				
				//海关审核未通过备注
				feedback: ''
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
			
			//请求审核未通数据
			getCheckInfo(){
				this.$request.get(
					this.$request.baseUrl + '/exec_ord/last_check?orderNumber='+this.orderNumber
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
					uni.navigateBack({
						delta: 1,
						animationDuration: 1000
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
