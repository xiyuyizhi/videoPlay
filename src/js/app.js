/**
 * Created by wangwei on 2016/4/28.
 */
$(function(){
    var player=new VideoPlay($('#video'),{
        'path':'http://v2.mukewang.com/7aeacc91-158b-4d01-9a66-0d6d81a18c7b/L.mp4?auth_key=1462021655-0-0-ae366b1ecd2ba7a992b94419fafb6c6f',
        //'path':'L.mp4',
        'autoplay':true
    });
    player.init();
});
