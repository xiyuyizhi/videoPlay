/**
 * Created by wangwei on 2016/4/28.
 */
$(function(){
    var player=new VideoPlay($('#video'),{
        'path':'2.mp4',
        'autoplay':false
    });
    player.init();
    $('.seek').click(function(){
        player.videoPlayer.get(0).currentTime =5;
        console.log(player.videoPlayer.get(0).seeking);
        console.log(player.videoPlayer.get(0).seekable.end(0))
    })
});