<template>
	<view class="cu-list menu  margin-top">
		<view class="cu-item  flex wrap" style="align-items: flex-start;">
			<view class="basis-xs radius padding-top-sm" style="float: left;">报关单:</view>
			<view class="basis-sm radius padding-top-sm" style="float: left;">{{t_order1.order_filename}}</view>
			<view style="float: right;" class="padding-top-sm basis-sm">
				<button size="mini" class="cu-btn round" @click="file_preview(t_order.orderFileDir)">预览</button>
				<button size="mini" class="cu-btn round" style="margin-left: 20px;margin-right: -10px;" @click="file_download(t_order.orderFileDir)">下载</button>
			</view>
		</view>
		<view class="cu-item flex wrap" style="align-items: flex-start;">
			<view class="basis-xs radius padding-top-sm" style="float: left;"><text>附件:</text></view>
			<view class="basis-lg radius padding-top-sm" style="float: left;">{{t_order1.order_accessory_filename}}</view>
			<view style="float: right;" class="padding-top-sm basis-xs">
				<button size="mini" class="cu-btn round" style="float: right;" @click="file_download(t_order.orderAccessoryDir)"
				 v-if="whether_orderAccessory_committed">下载</button>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/utils.js';
	export default {


		data() {
			return {
				t_order1: {
					order_filename: '',
					order_accessory_filename: '',
				},
				t_order: [],
				whether_orderAccessory_committed: true,
			}
		},
		props: [
			'orderNumber'
		],
		mounted() {
			this.getData();
		},
		methods: {
			getData() {
				const _this = this;
				_this.$request.get(
					_this.$request.baseUrl + '/apply_ord/select_by_ordernumber?orderNumber=' + _this.orderNumber, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(function(response) {
					_this.t_order = response.data.data;
					if (_this.t_order.orderFileDir !== null || _this.t_order.orderFileDir !== '') {
						_this.t_order1.order_filename = _this.t_order.orderFileName; //将报关单的文件路径中获取文件名
					}
					if (_this.t_order.orderAccessoryDir === null || _this.t_order.orderAccessoryDir === '') {
						_this.t_order1.order_accessory_filename = '暂无'; //将附件（要求）的文件路径中获取文件名
						_this.whether_orderAccessory_committed = false;
					}else{
						_this.t_order1.order_accessory_filename =_this.t_order.orderAccessoryName; //将附件（要求）的文件路径中获取文件名
					}
				});
			},
			file_download(filepath) {
				if (filepath == null || filepath === '') {
					alert("文件不存在，下载失败！");
					return;
				};
				this.$request.get(
					this.$request.baseUrl + '/File/file_download_url?FileDir=' + filepath, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(function(res) {
					console.log(res.data.msg);
					console.log(utils.getSessionID());
					//下载文件
					uni.downloadFile({
						url: res.data.msg,
						header: {
							'Authorization': utils.getSessionID()
						},
						success: (res) => {
							if (res.statusCode === 200) {
								console.log('下载成功');
								console.log(res.tempFilePath);
								//文件保存到本地
								uni.saveFile({
									tempFilePath: res.tempFilePath,
									success: function(res1) {
										uni.showToast({
											icon: 'none',
											mask: true,
											title: '文件已保存到：' + res1.savedFilePath, //保存路径
											duration: 4000,
										});
										console.log('文件已保存到：' + res1.savedFilePath);
										//判断下载下来的文件类型，若为pdf格式的文件，则直接在新页面打开
										var str = filepath;
										var obj = str.lastIndexOf(".");

										console.log(str.substr(obj + 1)); //将报关单的文件路径中获取文件后缀
										if (str.substr(obj + 1) == 'pdf') {
											uni.openDocument({
												filePath: res1.savedFilePath,
												success: function(res2) {
													console.log('打开文件成功');
												},
												fail: (res3) => {
													console.log(res3);
												}
											});
										}
									},
									fail: (err) => {
										console.log(err);
									}
								});
							}
						},
						fail: (err) => {
							console.log(err);
						}
					});
					//显示下载进度的组件
					// downloadTask.onProgressUpdate((res) => {
					//     console.log('下载进度' + res.progress);
					//     console.log('已经下载的数据长度' + res.totalBytesWritten);
					//     console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);

					//     // 测试条件，取消下载任务。
					//     if (res.progress > 50) {
					//         downloadTask.abort();
					//     } 
					// });
				});
			},
			file_preview(filepath) {
				if (filepath == null || filepath === '') {
					alert("文件不存在，下载失败！");
					return;
				};
				this.$request.get(
					this.$request.baseUrl + '/File/file_download_url?FileDir=' + filepath, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(function(res) {
					//下载文件
					uni.downloadFile({
						url: res.data.msg,
						header: {
							'Authorization': utils.getSessionID()
						},
						success: (res) => {
							if (res.statusCode === 200) {
								console.log(res.tempFilePath);
								//文件保存到本地
								uni.saveFile({
									tempFilePath: res.tempFilePath,
									success: function(res1) {
										//判断下载下来的文件类型，若为pdf格式的文件，则直接在新页面打开
										var str = filepath;
										var obj = str.lastIndexOf(".");
										console.log(str.substr(obj + 1)); //将报关单的文件路径中获取文件后缀
										if (str.substr(obj + 1) == 'pdf') {
											uni.openDocument({
												filePath: res1.savedFilePath,
												success: function(res2) {
													console.log('打开文件成功');
												},
												fail: (res3) => {
													console.log(res3);
												}
											});
										} else {
											const imageUrl = res1.savedFilePath; //http://192.168.100.251:8970/6_1597822634094.png
											var images = [];
											images.push(imageUrl); // ["http://192.168.100.251:8970/6_1597822634094.png"]
											uni.previewImage({ // 预览图片  图片路径必须是一个数组 => ["http://192.168.100.251:8970/6_1597822634094.png"]
												current: 0,
												urls: images,
												longPressActions: { //长按保存图片到相册
													itemList: ['保存图片'],
													success: (data) => {
														console.log(data);
														uni.saveImageToPhotosAlbum({ //保存图片到相册
															filePath: payUrl,
															success: function() {
																uni.showToast({
																	icon: 'success',
																	title: '保存成功'
																})
															},
															fail: (err) => {
																uni.showToast({
																	icon: 'none',
																	title: '保存失败，请重新尝试'
																})
															},
														});
													},
													fail: (err) => {
														console.log(err.errMsg);
													}
												}
											});
										}
									},
									fail: (err) => {
										console.log(err);
									}
								});
							}
						},
						fail: (err) => {
							console.log(err);
						}
					});

				});

			}
		}
	}
</script>

<style>

</style>
