<template>
	<div class="slides-box">
		
		<div class="btn-box">
			<el-button class="btn" type="danger" size="small" @click="delslides('all')" :disabled="checkedIds.length === 0">删除选中</el-button>
			<el-button class="btn" type="primary" size="small" @click="slidesOperate('add')">添加图片</el-button>
		</div>
		
		<el-table :data="list" border @selection-change="handleSelectionChange" v-loading="loading">
			<el-table-column align="center" type="selection" width="50">
			</el-table-column>
			<el-table-column prop="id" label="标题">
			</el-table-column>
			<el-table-column prop="url" align="center" width="150px" label="缩略图">
				<template slot-scope="scope">
					<el-popover placement="right" trigger="hover">
						<img :src="scope.row.url" style="max-height: 300px;max-width: 500px" />
						<img slot="reference" :src="scope.row.url" style="max-height: 30px;max-width: 130px">
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="type" align="center" label="类型" width="200">
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="slidesOperate('edit',scope.row)">编辑</el-button>
					<el-button @click.native="delslides('one', scope.row._id)" type="text" size="small" style="color: red;">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		
		<el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="limit"
		 layout="total,pager" :total="total">
		</el-pagination>
		
		<el-dialog :title="operateName" :visible.sync="slidesFormVisible" :close-on-press-escape="false"
		 :close-on-click-modal="false" width="60%" top="4vh">
			<el-form :model="slides" ref="slidesForm" :rules="rules" v-loading="uploading">
				<el-form-item label="顺序id" prop="id" label-width="90px">
					<el-input v-model="slides.id"></el-input>
				</el-form-item>
				<el-form-item label="类型" label-width="90px">
					<el-input v-model="slides.type"></el-input>
				</el-form-item>
				<el-form-item label="缩略图" style="margin-bottom: 0;">
					<div class="image-box" v-if="slides.url">
						<img :src="slides.url" class="image">
						<i class="el-icon-delete-solid" @click="deleteImage"></i>
					</div>
					<i v-else class="el-icon-plus image-uploader-icon" @click="uploadImage('slides')"></i>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="slidesFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				currentPage: 1, // 当前页数
				total: 0, // 总条数
				limit: 5, // 每页显示条数
				list: [],
				loading: false,
				checkedIds: [], // 选中的文章ID
				slidesFormVisible: false,
				slides: { },
				rules: {
					title: [{
						required: true,
						message: '请输入标题',
						trigger: 'blur'
					}]
				},
				operateName: '添加图片',
				uploading: false,
				readOnly: false,
				formats: {}
			}
		},
		//不知道干啥的，屏蔽后会显示正常，否则错误会一直转
		created() {
			uni.loadFontFace({
				family: 'Pacifico',
				source: 'url("https://sungd.github.io/Pacifico.ttf")'
			})
			this.getList()
			console.log("1245456456"+JSON.stringify(this.list))
			/*uniCloud.callFunction({
				name: 'addSlides',
				data: {
					id:3,
					type:'meage',
					url:'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-skys/b9e15ed0-92a7-11ea-9e8b-05a3242b26f2.jpeg'

				}
			}).then((res) => {;})*/
			/*let that = this
			uniCloud.callFunction({
				name: 'addSlides',
				data: that.slides
				
			}).then((res) => {;})*/
		},
		methods: {
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
			},
			undo() {
				this.editorCtx.undo()
			},
			redo() {
				this.editorCtx.redo()
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset
				if (!name) return
				// console.log('format', name, value)
				this.editorCtx.format(name, value)

			},
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success')
					}
				})
			},
			clearEditor() {
				this.editorCtx.clear()
			},
			removeFormat() {
				this.editorCtx.removeFormat()
			},
			insertDate() {
				const date = new Date()
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
				this.editorCtx.insertText({
					text: formatDate
				})
			},
			getList() {
				this.loading = true
				uniCloud.callFunction({
					name: "getSlidesList",
					data: {
						page: this.currentPage,
						limit: this.limit
					}
				}).then((res) => {
					if (res.success) {
						this.loading = false
						this.total = res.result.total
						this.list = res.result.data
					}
				})
				//this.list=[]
			},
			// 翻页
			handleCurrentChange(val) {
				this.page = val
				this.getList()
			},
			// 获取选中
			handleSelectionChange(val) {
				this.checkedIds = []
				val.forEach(item => {
					this.checkedIds.push(item._id)
				})
			},
			// 删除文章
			delslides(type, id) {
				this.$confirm('此操作将删除选中的文章, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					uniCloud.callFunction({
						name: "deleteSlides",
						data: {
							id: type === 'one' ? id : this.checkedIds,
							//delete_date: new Date().toLocaleDateString()
						}
					}).then((res) => {
						this.$message({
							type: 'success',
							message: '删除成功',
							duration: 800,
							offset: 200,
							onClose: () => {
								this.getList()
							}
						})
					})
				}).catch(() => {
					// 取消
				})
			},
			//操作
			slidesOperate(type, slides) {
				this.slides = {}
				/*if (this.editorCtx) {
					this.clearEditor()
				}*/
				if (type === 'add') {
					this.operateName = '添加文章'
				}
				if (type === 'edit') {
					this.operateName = '编辑文章'
					this.slides = slides
					console.log("update+++"+this.slides.id)
					this.uploading = true
					uniCloud.callFunction({
						name: "getSlides",
						data: {
							id: slides.id
						}
					}).then((res) => {
						this.uploading = false
						/*this.editorCtx.setContents({
							html: res.result.data[0].content,
							complete: () => {
								this.uploading = false
							}
						})*/
					})
				}
				this.slidesFormVisible = true
			},
			
			uploadImage(type) {
				let that = this
				uni.chooseImage({
					count: 1,
					success: images => {
						that.uploading = true
						//上传文件到云存储
						uniCloud.uploadFile({
							//进行上传操作
							filePath: images.tempFilePaths[0],
							success(res) {
								that.uploading = false
								that.slides.url = res.fileID
								// if (type === 'editor') {
								// 	that.editorCtx.insertImage({
								// 		src: res.fileID
								// 	})
								// } else {
								// 	that.slides.url = res.fileID
								// }
							}
						})
					}
				})
			},
			deleteImage() {
				this.uploading = true
				let that = this
				uniCloud.deleteFile({
					fileList: [that.slides.url],
					complete() {
						that.uploading = false
						that.slides.url = ''
					}
				})
			},
			//添加信息成功
			submitForm() {
				console.log(JSON.stringify(this.slides))
				let that = this
				let slides = that.slides
				console.log("1111"+JSON.stringify(slides))
				/*let slides = {
					...that.slides
				}*/
				if (!slides.id) {
					this.$message({
						showClose: true,
						message: '文章标题不能为空',
						type: 'warning'
					})
					return
				}
				/*if (res.html === '<p><br></p>') {
					this.$message({
						showClose: true,
						message: '文章内容不能为空',
						type: 'warning'
					})
				} else */{
					that.uploading = true
					let url = 'addSlides'
					if (slides.id) {
						url = 'updateSlides'
						slides.id = slides.id
						delete(slides["_id"])
						//slides.update_time = new Date().toLocaleString()
					} else {
						//slides.add_time = new Date().toLocaleString()
					}
					console.log("2222"+url+JSON.stringify(slides))
					uniCloud.callFunction({
						name: url,
						data: that.slides
					}).then((res) => {
						that.uploading = false
						that.slidesFormVisible = false
						that.getList()
						this.$message({
							showClose: true,
							message: '操作成功',
							type: 'success'
						})
					})
				}
				/*that.editorCtx.getContents({
					success: res => {
						if (res.html === '<p><br></p>') {
							this.$message({
								showClose: true,
								message: '文章内容不能为空',
								type: 'warning'
							})
						} else {
							that.uploading = true
							let url = 'addSlides'
							if (slides._id) {
								url = 'updateSlides'
								slides.id = slides._id
								delete(slides["_id"])
								//slides.update_time = new Date().toLocaleString()
							} else {
								slides.add_time = new Date().toLocaleString()
							}
							uniCloud.callFunction({
								name: url,
								data: {
									...slides,
									//delete_date: '0',
									//content: res.html
								}
							}).then((res) => {
								that.uploading = false
								that.slidesFormVisible = false
								that.getList()
								this.$message({
									showClose: true,
									message: '操作成功',
									type: 'success'
								})
							})
						}
					}
				})*/
			}
		}
	}
</script>
<style lang="less" scoped>
	@import "@/static/css/editor-icon.css";

	.iconfont {
		display: inline-block;
		padding: 8px 8px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-size: 20px;
	}

	.toolbar {
		box-sizing: border-box;
		border-bottom: 0;
		font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
		margin-top: 5px;
	}


	.ql-container {
		box-sizing: border-box;
		padding: 10px 10px;
		width: 100%;
		min-height: 20vh;
		height: auto;
		background: #fff;
		font-size: 16px;
		line-height: 1.5;
	}

	.ql-active {
		color: #06c;
	}

	.slides-box {
		.btn-box {
			margin-bottom: 10px;

			.btn {
				margin-right: 10px;
			}
		}

		.el-pagination {
			margin-top: 20px;
		}
	}

	.image-box {
		position: relative;
		width: 120px;
		height: 120px;
		margin-left: 50px;

		.image {
			width: 120px;
			height: 120px;
			position: absolute;
			left: 0;
			top: 0;
		}

		.el-icon-delete-solid {
			color: red;
			position: absolute;
			bottom: 0;
			right: 0;
			font-size: 20px;
		}
	}

	.ql-editor {
		padding: 0;
	}

	.image-uploader-icon {
		border: 1px dashed #55aaff;
		font-size: 28px;
		color: #8c939d;
		width: 120px;
		height: 120px;
		line-height: 120px;
		text-align: center;
	}
</style>
