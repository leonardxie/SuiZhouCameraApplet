<template>
	<view>
		<view class="cu-list menu margin-top">
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
					 v-if="whether_order_accessory_committed">下载</button>
				</view>
			</view>
			<view class="cu-item flex wrap" style="align-items: flex-start;" v-if="whether_entrust_committed">
				<view class="basis-xs radius padding-top-sm" style="float: left;"><text>委托单:</text></view>
				<view class="basis-sm radius padding-top-sm" style="float: left;">{{t_order1.entrust_filename}}</view>
				<view style="float: right;" class="padding-top-sm basis-sm">
					<button size="mini" class="cu-btn round" @click="file_preview(t_order.entrustFileDir)" v-if="whether_entrust_committed">预览</button>
					<button size="mini" class="cu-btn round" style="margin-left: 20px;margin-right: -10px;" @click="file_download(t_order.entrustFileDir)"
					 v-if="whether_entrust_committed">下载</button>
				</view>
			</view>
			<view class="cu-bar bg-white" v-if="!whether_entrust_committed">
				<view class="action required">
					委托单
				</view>
				<view class="action">
					jpg/jpeg/png/pdf
				</view>
			</view>
			<view class="cu-form-group margin-bottom" v-if="!whether_entrust_committed">
				<view class="grid col-4 grid-square flex-sub margin-bottom">
					<Attachment mode="create" :canUploadFile="true" :uploadFileUrl="uploadFileUrl" :attachmentList.sync="attachmentList"
					 :fileDir.sync="entrustFileDir" :header="header" :showProcess="true" :limit=1 :exts="entrustFileExts" :chooseType="entrustFileType"
					 @updateRealFileName="updateEntrustFileName"></Attachment>
				</view>
				<button class="cu-btn round" @click="commitEntrust">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/utils.js';
	import Attachment from '../jin-attachment/jin-attachment.vue'
	export default {
		components: {
			Attachment
		},
		data() {
			return {
				t_order1: {
					order_filename: '',
					order_accessory_filename: '',
					entrust_filename: '',
					spot_picture_filename: '',
					spot_record_filename: ''
				},
				t_order: [],
				whether_order_accessory_committed: true,
				whether_entrust_committed: true,
				whether_spot_record_committed: true,
				whether_spot_picture_committed: true,

				entrustFileExts: ['jpg', 'jpeg', 'png', 'pdf'],
				entrustFileType: 'file',
				uploadFileUrl: this.backendUrl + '/File/file_upload',
				header: {
					'Authorization': utils.getSessionID()
				},
				entrustFileDir: '',
				realentrustFileName: '',
			};
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
					_this.$request.baseUrl + '/order/select_by_ordernumber?orderNumber=' + _this.orderNumber, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(function(response) {
					_this.t_order = response.data.data;

					if (_this.t_order.orderAccessoryDir === null || _this.t_order.orderAccessoryDir === '') {
						_this.t_order1.order_accessory_filename = "暂无"; //将附件（要求）的文件路径中获取文件名
						_this.whether_order_accessory_committed = false;
					} else {
						_this.t_order1.order_accessory_filename = _this.t_order.orderAccessoryName; //将附件（要求）的文件路径中获取文件名
					}

					if (_this.t_order.entrustFileDir === null || _this.t_order.entrustFileDir === '') {
						_this.t_order1.entrust_filename = "第三方还未上传"; //将委托单的文件路径中获取文件名
						_this.whether_entrust_committed = false;
					} else {
						_this.t_order1.entrust_filename = _this.t_order.entrustFileName; //将委托单的文件路径中获取文件名
					}

					if (_this.t_order.spotRecordDir === null || _this.t_order.spotRecordDir === '') {
						_this.t_order1.spot_record_filename = "第三方还未上传"; //将现场记录的文件路径中获取文件名
						_this.whether_spot_record_committed = false;
					} else {
						_this.t_order1.spot_record_filename = _this.t_order.spotRecordName; //将现场记录的文件路径中获取文件名
					}

					if (_this.t_order.spotPictureDir === null || _this.t_order.spotPictureDir === '') {
						_this.t_order1.spot_picture_filename = "第三方还未上传"; //将现场照片的文件路径中获取文件名
						_this.whether_spot_picture_committed = false;
					} else {
						_this.t_order1.spot_picture_filename = _this.t_order.spotPictureName; //将现场照片的文件路径中获取文件名
					}
					if (_this.t_order.orderFileDir !== null || _this.t_order.orderFileDir !== '') {
						_this.t_order1.order_filename = _this.t_order.orderFileName; //将报关单的文件路径中获取文件名
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

			},
			pushIntoDb: function(data) {
				this.$request.put(
					_this.$request.baseUrl + '/order/update_field', data, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(function(response) {
					console.log("success");
				});

			},
			updateEntrustFileName: function(fileName = '') {
				this.realentrustFileName = fileName;
			},
			commitEntrust() {
				const _this = this;
				let data1 = {
					field: 'entrustFileDir',
					newContent: _this.entrustFileDir,
					orderNumber: _this.orderNumber
				}
				let data2 = {
					field: 'entrustFileName',
					newContent: _this.realentrustFileName,
					orderNumber: _this.orderNumber
				}
				_this.$request.put(
					_this.$request.baseUrl + '/order/update_field', data1, {
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).then(function(response) {
					console.log("success");
					_this.$request.put(
						_this.$request.baseUrl + '/order/update_field', data2, {
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}
					).then(function(response) {
						console.log("success");
						_this.$emit('updateEntrustFileStatus', 'refresh');
					});
				});
			},
		}
	}
</script>

<style>

</style>
