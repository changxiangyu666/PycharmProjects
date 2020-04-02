/* @author:Romey
	 * 动态点赞
	 * 此效果包含css3，部分浏览器不兼容（如：IE10以下的版本）
	*/
	$(function(){
		var oExports = {
			initialize: initheart,
		};
		oExports.initialize();

		function initheart() {
			$(".icobutton").on('click', function () {
				let sImageId = this.value;
				//var text_box = $('.'+sImageId+'');
				if ($(this).children('span').attr("class") === ("heart")) {
					$(this).html("<span class=\"after-heart\"></span>");
					//text_box.show().html("<em class='add-animation'>+1</em>");
					$(".add-animation").addClass("hover");
					$.ajax({
						url: '/add/fabulous/',
						type: 'post',
						dataType: 'json',
						data: {image_id: sImageId},
					})
				} else {
					$(this).html("<span class=\"heart\"></span>");
					//text_box.show().html("<em class='add-animation'>-1</em>");
					$(".add-animation").removeClass("hover");
					$.ajax({
						url: '/delete/fabulous/',
						type: 'post',
						dataType: 'json',
						data: {image_id: sImageId},
					})
				}
			});
		}
	});