<template>
	<view>
		<view class="bg-white" style="margin-top: 10px;">
			<view class="flex solid-bottom padding-xs justify-center" style="margin: auto;">
				<view class="radius text-bold" style="text-align: center;">直播名称</view>
			</view>	
		</view>
	<uni-collapse accordion="true">
		<view v-for="(value, key) in live" :key="index">
	    <uni-collapse-item :title=value.liveName showAnimation="true">
	        <view style="padding: 30rpx;">
	            开始时间：{{value.planStartTime}}
	        </view>
					<view style="padding: 30rpx;">
					    结束时间：{{value.planEndTime}}
					</view>
					<view style="padding: 30rpx;">
					    描述：{{value.liveInfo}}
					</view>
	    </uni-collapse-item> 
		</view>
	</uni-collapse>
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	    
	export default {
		data() {
			return {
				live:[]
			};
		},
		components: {uniCollapse,uniCollapseItem}
		,
		created(){
			this.getDepotInfo();
		},
		methods:{
			getDepotInfo(){
				//将直播预告信息获取下来并显示在程序页面中
				const _this = this;
				this.$request.get(
					this.$request.baseUrl + '/depot/select_live_list?depotId=1&orderColumn=plan_start_time&sortOrder=0' , {},{
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(function(res) {
					_this.live=res.data.data;
					console.log(_this.live);
				});
			},
		}
	}
</script>

<style>

</style>