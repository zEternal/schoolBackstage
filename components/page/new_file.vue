<template>
	<view>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">工学院简介</block>
		</cu-custom>
		<button type="primary" @click="fun">test</button>
	</view>
	<view class="title">工学院召开“云宣讲”专场招聘会 ----疫情期间，助力毕业生就业 </view>
	
	<view class="publisher-info">
	  <image class="face" src="https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"></image>
	
	    <view class="words">
	      <view class="nickname">艺术学院</view>
	        <view class="normal-info">
	          <view class="original">原创</view>
	            <view class="create-time">发布于2020-4-25</view>
	      </view>
	    </view>
	</view>
	
	<rich-text class='news-desc' :nodes="content"></rich-text>
</view>
</template>

<script>
	Page({
	  data: {
	    content:"<p> 自疫情以来，工学院全体教师积极开展线上教学，大力推进课堂教学改革，教师们灵活运用在线平台及教学方式。</p><img src='https://cdn.pixabay.com/photo/2020/04/24/00/49/yellow-5084544_1280.jpg' style='width:100%;'> <p> 为加强教学管理，完善质量监控体系，确保教学工作有序、高效运行，工学院制定学院教学工作定期检查制度，及时发现和解决教学过程中存在的问题，切实保证教育教学质量。工学院院长、副院长等集体听课。</p><img src='https://cdn.pixabay.com/photo/2020/04/24/20/40/stork-5088633_1280.jpg' style='width:100%;'><p>工学院院长、副院长等集体听课，通过超星平台对日常教学进行了检查，深入课堂，聆听教师线上授课，查看授课教师发布的学习任务、课程视频、课件、在线教材、答疑互动、课程知识点和学生课堂学习气氛等内容。并对教师课程中存在的问题，特别是教学督导发现的问题，进行集体听课，综合评价，课后与授课老师进行交流、指导。要求教师正视不足,发扬优点，对指出的问题要进行整改，拿出具体的行动，实行回头看，查看整改措施和效果，切实提高线上教育教学质量。</p> "
	  }	  
	});
	export default {
		
		methods: {
			fun: function() {
				console.log('函数运行......');
				uni.showLoading();
				uniCloud.callFunction({
					name: "test",
					data: {
						id: "001",
						type: "image"
					}
				}).then((res) => {
					uni.hideLoading();
					console.log(res);
					var msg = res.result;
					console.log(msg.data[0].url);
				});
			}
		}
	}
</script>

<style>
page{
  display: flex;
  flex-direction: column;
}
.title{
  margin:20rpx 30rpx;
  font-size:26px;
}
/* 头像 */
.face{
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}
/* 两边留有间隙 */
.publisher-info{
  margin: 0 30rpx;
  display: flex;
  flex-direction:row;
}
.words{
  margin-left: 30rpx;
}

.nickname{
  font-size: 16px;
}
/* 嵌套的flex布局 */
.normal-info{
  display: flex;
  flex-direction:row;
  margin-top: 6rpx;
}
.original{
  font-size: 10px;
  color: gray;
  border-radius:10rpx;
  background: white;
  width: 70rpx;
  height: 30rpx;
  text-align: center;
  border: solid 1px;
}
.create-time{
  font-size: 13px;
  color: gray;
  margin-left: 30rpx;
}
/* 新闻文本
 */
.news-desc{
  margin: 26rpx 30rpx;
}
</style>