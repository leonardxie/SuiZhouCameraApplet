<template>
	<view>
		
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="flex-sub radius">车厂信息</view>
			</view>
			
			<view class="cu-item">
				<view class="flex-sub radius">车厂名称：{{depot.depotName}}</view>
				<view class="flex-sub radius">联系方式：{{depot.phone}}</view>
			</view>
			<view class="cu-item">
				<view class="flex-sub radius">车厂地址：{{depot.address}}</view>
			</view>
			<view class="cu-item">
				<view class="flex-sub radius">车厂简介：{{depot.depotInfo}}</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				depot:{
					address: '',
					depotId: 1,
					depotInfo: '',
					depotName: '',
					phone: '',
					userId: 2,
					userName: "mao",
				}
			};
		},
		created(){
			this.getDepotInfo();
		},
		methods:{
			getDepotInfo(){
				//将车厂信息获取下来并显示在程序页面中
				const _this = this;
				this.$request.get(
					this.$request.baseUrl + '/depot/get_depot_info?depotId=1' , {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(function(res) {
					_this.depot=res.data.data;
				});
				
			},
		}
	}
</script>

<style>

</style>
