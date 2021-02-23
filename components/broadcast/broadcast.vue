<template>
	<view>
		<!--直播列表区域-->
		<view class="bg-white" style="margin-top: 10px;">
			<view class="flex solid-bottom padding-xs justify-center" style="margin: auto;">
				<view class="radius text-bold" style="text-align: center;">选择摄像头观看直播</view>
			</view>	
		</view>		
		<view class="solids text-black">
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
			  @scroll="scroll" style="height: 30vh;" show-scrollbar="true">
 			  <view class="grid" :class="'col-2' ">
					<view v-for="(item,index) in broadcastData" :key="index" @click="toLive(index)" >
						<view class="cu-card case">
							<view class="cu-item shadow">
				  			<view class="image">
									<image :src=broadcastData[index].imgUrl
										mode="widthFix"></image>
									<view class="cu-tag bg-blue">直播</view>
									<view class="cu-bar bg-shadeBottom"> <text class="text-cut">{{item.deviceName}}</text></view>
								</view>
								<view class="cu-item padding">
									<view class="text-grey">{{item.deviceInfo}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>	
		</view>	
		<!--直播视频区域-->
		<view class="bg-white" style="margin-top: 30px;">
			<view class="flex solid-bottom padding-xs justify-center" style="margin: auto;">
				<view class="radius text-bold" style="text-align: center;">视频播放区</view>
			</view>
			<yfsVideo 
			    :src="src" 
			    :danmu-list="danmuList" 
			    :videoTitle="videoTitle"
					:enable-danmu="false"
					></yfsVideo>
			<view class="flex-sub  padding-sm margin-xs radius">
				<button  class="cu-btn bg-blue lg" role="button" aria-disabled="false" @click="broadcastIntroduction"
					style="width: 80%;margin-left: 10%;">车厂简介</button>
			</view>
			<!-- <video id='myVideo' 
			  autoplay="true" :src="src"
			 controls page-gesture show-mute-btn show-fullscreen-btn  direction='90'
			 object-fit="contain" play-btn-position="center"
			 show-casting-button="true" picture-in-picture-mode=" ['push', 'pop']" enable-auto-rotation="true"
			 style="margin: auto;width: 350px;height: 225px;"
			 @fullscreenchange="fullscreenchange()"></video> -->
		</view>
	</view>
</template>

<script> 
import yfsVideo from '../yfs-video/yfs-video.vue';
	export default {
		components:{
			yfsVideo
		},
		data() {
			return {
				src: '',
				danmuList: [],
				videoCurrTime:0,
				videoTitle:"",
				scrollTop:0,
				old: {
				  scrollTop: 0
				},
				//src: '',
				broadcastData:{
					createTime: "",
					depotId: 1,
					depotName: "神百专汽",
					deviceId: 0,
					deviceInfo: "",
					deviceLink: "",
					deviceName: "",
					deviceNum: 0,
					updateTime: "",
					imgUrl:'',
				},
			};
		},
		onReady: function (res) {
		  this.videoContext = uni.createVideoContext('myVideo');
			this.videoContext.requestFullScreen();
		},
		created() {
			//获取直播列表
			this.getDevice();
			//this.getvideoIntroduction();
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
					_this.broadcastData=res.data.data;
					var obj=res.data.data;
					for(let i=1;i<=Object.keys(obj).length;i++){
						_this.broadcastData[i-1].imgUrl='../../static/'+i+'.jpg';
					}
				});
			},
			toLive(index){
				this.src=this.broadcastData[index].deviceLink;
				
			},
			fullscreenchange(e){
				console.log(e);
				this.videoContext = uni.createVideoContext('myVideo');
				this.videoContext.requestFullScreen();
			},
			getTimeVideo:function(e){
			  console.log(e);
			},
			broadcastIntroduction(){
				this.src='';
				this.src='https://www.indulive.com:443/dep/introduction.mp4';
				
			}
		}
	}
</script>

<style>

</style>
