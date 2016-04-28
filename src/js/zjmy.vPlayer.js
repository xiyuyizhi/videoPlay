/**
 * Created by wangwei on 2016/4/27.
 */
/***
 * �¼��Ⱥ�˳��:
 * loadedmetadata
 * loadeddata
 * canplay
 * oncanplaythrough
 */
$(function () {
    var timer,
        store={
            'duration':0,
            'currentTime':0
        },
        videoPlayer = $('#video'),
        videoWrap=$('#videoWrap'),
        height = {
            'screenHeight': $(window).height(),
            'videoOriginHeight': 0
        };
    videoPlayer.on('canplay', function () {
        console.log('canplay')
    });
    videoPlayer.on('canplaythrough', function () {
        console.log('oncanplaythrough')
    })
    videoPlayer.on('loadeddata', function (data) {
        console.log('loadeddata');
        console.log(videoPlayer.get(0).duration);
        var timeStr;
        store['duration']=videoPlayer.get(0).duration;
        timeStr=formateTime(videoPlayer.get(0).duration).join(':');
        videoWrap.find('.totalTime').html(timeStr);
    });
    videoPlayer.on('loadedmetadata', function (data) {
        console.log('loadedmetadata');
        console.log(data)
    });
    videoPlayer.on('ended', function (e) {
        console.log('ended');
        store['currentTime']=0;
        clearInterval(timer);
    });

    $('button').click(function () {
        videoPlayer.addClass('fullScreen')
    });
    $(document).on('click', 'button', function (e) {
        switch (e.target.className) {
            case 'btn_play':
                videoPlayer.get(0).play();
                clearInterval(timer);
                timer=setInterval(timerFn,1000);
                break;
            case 'btn_pause':
                videoPlayer.get(0).pause();
                clearInterval(timer);
                break;
            case 'btn_fullScreen':
                if ($(this).text() == '全屏') {
                    $('#videoWrap').addClass('fullScreen');
                    videoPlayer.addClass('fullScreen');
                    $(this).text('还原');
                } else {
                    $('#videoWrap').removeClass('fullScreen');
                    videoPlayer.removeClass('fullScreen');
                    $(this).text('全屏')
                }
                break;
        }
    });

    function timerFn(){
        store.currentTime++;
        if(store.currentTime>=Math.ceil(store.duration)){
            clearInterval(timer);
        }
        scrollBarFn(videoWrap,store)
    }

    //格式化视频时长
    function formateTime(second){
        var timeArr=[];
        if(second>3600){
            if(second>=3600*10){
                timeArr.push(Math.floor(second/3600))
            }else{
                timeArr.push('0'+Math.floor(second/3600))
            }
            timeArr.push('00').push('00');
        }else if(second>60){
            timeArr.push('00');
            if(second>=60*10){
                timeArr.push(Math.floor(second/60))
            }else{
                timeArr.push('0'+Math.floor(second/60))
            }
            if((second%60)>10){
                timeArr.push(Math.ceil(second%60))
            }else{
                timeArr.push('0'+Math.ceil(second%60))
            }
        }else{
            timeArr.push('00');
            timeArr.push('00');
            timeArr.push(Math.ceil(second));
        }
        return timeArr;
    };

    function scrollBarFn($obj,store){
        var $scrollPoint=$obj.find('.processBar_scrollPoint'),
            $processBar_bg=$obj.find('.processBar_bg'),
            pointWidth=(store.currentTime/store.duration)*$processBar_bg.width();
        pointWidth=Math.ceil(pointWidth);
        $scrollPoint.css('width',pointWidth+'px');
        console.log(pointWidth);

    }

})