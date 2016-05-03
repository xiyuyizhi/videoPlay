/**
 * Created by wangwei on 2016/4/28.
 */
$(function(){
    var player=new VideoPlay($('#video'),{
        'path':'http://v2.mukewang.com/41d14462-adc8-4172-9b48-31fee3de03b8/L.mp4?auth_key=1462243840-0-0-c8ea0830bd0d2ad518f07fcb2f334d9e',
        'autoplay':true
    });
    player.init();
});
