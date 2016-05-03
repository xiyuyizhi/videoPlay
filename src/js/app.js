/**
 * Created by wangwei on 2016/4/28.
 */
$(function(){
    var player=new VideoPlay($('#video'),{
        'path':'http://v2.mukewang.com/f3bb55c2-87de-4487-90e5-1afbcd501655/L.mp4?auth_key=1462274893-0-0-d07916b7efb9fbc239ddb2ee9f6ac356',
        'autoplay':true
    });
    player.init();
});
