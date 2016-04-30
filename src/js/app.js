/**
 * Created by wangwei on 2016/4/28.
 */
$(function(){
    var player=new VideoPlay($('#video'),{
        'path':'http://v2.mukewang.com/7aeacc91-158b-4d01-9a66-0d6d81a18c7b/L.mp4?auth_key=1462019838-0-0-28032a8e9a987c1cb8d22eea0af81475',
        //'path':'L.mp4',
        'autoplay':true
    });
    player.init();
});
