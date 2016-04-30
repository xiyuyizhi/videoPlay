/**
 * Created by wangwei on 2016/4/28.
 */
$(function(){
    var player=new VideoPlay($('#video'),{
        'path':'http://v2.mukewang.com/7aeacc91-158b-4d01-9a66-0d6d81a18c7b/L.mp4?auth_key=1462024016-0-0-9a798ee7411daecc973de886012f6179',
        'autoplay':true
    });
    player.init();
});
