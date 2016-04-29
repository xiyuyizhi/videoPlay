/**
 * Created by wangwei on 2016/4/28.
 */
$(function(){
    var player=new VideoPlay($('#video'),{
        'path':'1.mp4',
        'autoplay':false
    });
    player.init();
});