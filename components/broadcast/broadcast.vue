<template>
	<view>
		<!--直播列表区域-->
		<view class="bg-white margin">
			<view class="flex solid-bottom padding-xs justify-center" style="margin: auto;">
				<view class="radius text-bold" style="text-align: center;">选择摄像头观看直播</view>
			</view>			
			<view class="flex padding-xs" >
				<view class="flex-sub radius text-bold" >摄像头名称</view>
				<view class="flex-sub radius text-bold" >摄像头简介</view>
			</view>
			<view>
				 <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
				               @scroll="scroll" style="height: 100px;" show-scrollbar="true">
							<view v-for="(item,index) in broadcastData" :key="index" class="flex padding solid scroll-view-item" >
							<view class="flex-sub  margin-right radius solid-left">{{item.name}}</view>
							<view class="flex-sub  margin-right radius">{{item.info}}</view>
						</view>
				 </scroll-view>	
			</view>
		</view>
		
		<!--直播视频区域-->
		<view>
			<view>视频播放区</view>
			<video id="myVideo" 
			 src="https://cmgw-vpc.lechange.com:8890/LCO/6K03AF4PAG4FAEA/0/1/20201223T223112/864f6c202d30d8c5fecc60ea071eb2b9.m3u8"
			 controls="true" page-gesture="true"
			 style="width: 300px;height: 225px;margin: auto;"></video>
		</view>
	</view>
</template>

<script> 
	export default {
		data() {
			return {
				src: '',
				broadcastData:[{
					name:12,
					info:"asd"
				},
				{
					name:13,
					info:"asdad"
				},
				{
					name:13,
					info:"asdad"
				},
				{
					name:13,
					info:"asdad"
				},
				{
					name:13,
					info:"asdad"
				}],
				scrollTop: 0,
				old: {scrollTop: 0},
			};
		},
		created() {
			//获取直播列表
			this.getDevice();
		},
		methods:{
			upper: function(e) {          
			},
			lower: function(e) {
			},
			scroll: function(e) { 
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop: function(e) {
			  this.scrollTop = this.old.scrollTop
			  this.$nextTick(function() {
					this.scrollTop = 0
				});
			},
			getDevice(){	
				const _this = this;
				this.$request.get(
					this.$request.baseUrl + '/depot/get_device?depotId=1' , {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(function(res) {
					console.log(res.data.data);
				});
			}
		}
	}
</script>

<style>

</style>
