<template>
	<view class="home">
		<!-- 自定义导航栏 -->
		
		<navbar></navbar>
		<tab @tab="tab" :tabIndex="tabIndex" :tabItemContent="tabText"></tab>
		<sl-filter :color="titleColor" :independence="true" :themeColor="themeColor" :menuList="menuList" @result="result" ref="filter"></sl-filter>
		<view class="home-list">
			<view>
				<text class="align-center">
					欢迎登陆！
				</text>
			</view>
			<list :tab="tabText" :activeIndex="activeIndex" @change="change" ref="list"></list>
		</view>
		<view class="send">
			<button @click="createProject" class="cu-btn cuIcon send-button">
				<text class="cuIcon-add send-icon"></text>
			</button>
		</view>
	</view>
</template>


<script>
	import slFilter from '@/components/sl-filter/sl-filter.vue';
	import {filterOther,filterOwner} from './data.js'
	import utils from '../../../utils/utils.js'
	export default {
		components: {
			slFilter
		},
		watch: {	//监听当前页activeIndex，改变筛选框中的小状态内容
			activeIndex(newval) {
				if (newval == 0) {
					let tempDetailList = [{
						'title': '已发布未派单',
						'value': [1]
					}, ]
					if(utils.getLoginType()==='owner'){
						this.menuList[0].detailList = tempDetailList;
					}
					else{
						this.menuList[1].detailList = tempDetailList;
					}
				}
				if (newval == 1) {
					let tempDetailList = [{
							'title': '全部',
							'value': [2, 3, 8]
						},
						{
							'title': '已派单未执行',
							'value': [2]
						},
						{
							'title': '执行中',
							'value': [3]
						},
						{
							'title': '执行未通过',
							'value': [8]
						}
					]
					if(utils.getLoginType()==='owner'){
						this.menuList[0].detailList = tempDetailList;
					}
					else{
						this.menuList[1].detailList = tempDetailList;
					}
				}
				if (newval == 2) {
					let tempDetailList = [{
							'title': '全部',
							'value': [4, 6, 7]
						},
						{
							'title': '已执行未提交',
							'value': [4]
						},
						{
							'title': '已提交未审核',
							'value': [6]
						},
						{
							'title': '审核未通过',
							'value': [7]
						}
					]
					if(utils.getLoginType()==='owner'){
						this.menuList[0].detailList = tempDetailList;
					}
					else{
						this.menuList[1].detailList = tempDetailList;
					}
				}
				if (newval == 3) {
					let tempDetailList = [{
						'title': '审核通过',
						'value': [9]
					}, ]
					if(utils.getLoginType()==='owner'){
						this.menuList[0].detailList = tempDetailList;
					}
					else{
						this.menuList[1].detailList = tempDetailList;
					}
				}
				if (newval == 4) {
					let tempDetailList = [{
						'title': '超期',
						'value': [5]
					}, ]
					if(utils.getLoginType()==='owner'){
						this.menuList[0].detailList = tempDetailList;
					}
					else{
						this.menuList[1].detailList = tempDetailList;
					}
				}
			}
		},
		data() {
			return {
				themeColor: '#000000',
				//筛选返回结果
				filterResult: '',
				//筛选框内容
				menuList:[],
				tabText: [],
				tabIndex: 0,
				activeIndex: 0,
				itemlist: [],
				//页面信息
				pageInfo: {
					name: "查看",
					pageId: 0
				}
			}
		},
		onShow() {
			console.log(this.activeIndex+"C");
			getApp().globalData.tabIndex = this.pageInfo.pageId;
			this.justBack();
		},
		created() {
			if(utils.getLoginType()==='staff'){
				this.menuList=filterOther
				this.tabText=['派单', '执行', '审核', '完结', '超时']
			}
			if(utils.getLoginType()==='employee'){
				this.menuList=filterOther
				this.tabText=['接单', '执行', '提交', '完结', '超时']
			}
			if(utils.getLoginType()==='owner'){
				this.menuList=filterOwner
				this.tabText=['正在派单', '执行', '审核', '完结', '超时']
			}
		},
		methods: {
			result(val) {  //获取筛选框返回的内容，修改请求对应的参数，重新获取数据
				if (val.scope != null) {
					this.$refs.list.scope = val.scope
					this.$refs.list.load[this.activeIndex].page = 1
					this.$refs.list.listCatchData[this.activeIndex] = []
					this.$refs.list.getlist()
				}
				if (val.state) {
					let arr = []
					for (let i = 0; i < val.state.length; i++) {
						arr.push(val.state[i]);
					}
					this.$refs.list.isFilter = true
					this.$refs.list.item = arr
					this.$refs.list.load[this.activeIndex].page = 1
					this.$refs.list.listCatchData[this.activeIndex] = []
					this.$refs.list.getlist()
				}
				if (val.sorts) {
					this.$refs.list.order = val.sorts
					this.$refs.list.load[this.activeIndex].page = 1
					this.$refs.list.listCatchData[this.activeIndex] = []
					this.$refs.list.getlist()
				}
			},
			change(current) {
				this.tabIndex = current
				this.activeIndex = current
			},
			tab(data, index) {
				this.activeIndex = data.index
				this.$refs.filter.tabclose();
			},
			createProject() {
				uni.navigateTo({
					url: '/pages/send/send'
				});
			},
			justBack: function() {
				console.log("返回刷新");
				console.log(this.activeIndex+"A");
				this.$refs.list.listCatchData[this.activeIndex] = []; // 调用子组件的方法
				this.$refs.list.load[this.activeIndex].page=1;
				this.$refs.list.getlist(); // 调用子组件的方法 
				console.log(this.$refs.list.listCatchData[this.activeIndex] );
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
		overflow-x: hidden;
	}

	.home {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;

		.home-list {
			flex: 1;
			box-sizing: border-box;
		}

		.send {
			position: absolute;
			right: 4%;
			bottom: 2%;

			.send-button {
				height: 110rpx;
				width: 110rpx;
				background-color: $jgcy-color-base;
				color: #fff;

				.send-icon {
					font-size: 65rpx;
				}
			}
		}
	}
</style>
