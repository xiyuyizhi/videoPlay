/**
 * Created by wangwei on 2016/4/27.
 */
/***
 * 执行顺序
 * loadedmetadata
 * loadeddata
 * canplay
 * oncanplaythrough
 */
(function (w) {
    w.VideoPlay = VideoPlay;

    function VideoPlay($obj, videoPath) {
        this.timer = null;
        this.store = {
            'duration': 0,
            'currentTime': 0
        };
        this.videoPlayer = $obj;
        this.videoWrap = $obj.parent();
        this.videoPath = videoPath;
        this.unit = new Unit();
    }

    VideoPlay.prototype.init = function () {
        this.videoPlayer.attr('src', this.videoPath);
        this.videoPlayer.get(0).volume = 0.5;
        this.loadedMeta();
        this.eventHandle();
        this.end();
    };

    VideoPlay.prototype.loadedMeta = function () {
        var _this = this;
        this.videoPlayer.on('loadedmetadata', function (e) {
            console.log(e)
            var timeStr;
            _this.store['duration'] = e.target.duration;
            timeStr = _this.unit.formateTime(e.target.duration).join(':');
            _this.videoWrap.find('.totalTime').html(timeStr);
        })
    };
    VideoPlay.prototype.end = function () {
        var _this = this;
        this.videoPlayer.on('ended', function (e) {
            console.log('ended');
            _this.store['currentTime'] = 0;
            clearInterval(_this.timer);
        });
    };
    VideoPlay.prototype.eventHandle = function () {
        var _this = this,
            $lessVoice = this.videoWrap.find('.less_voice'),
            $moreVoice = this.videoWrap.find('.more_voice'),
            $button = this.videoWrap.find('button');
        $button.on('click', function (e) {
            switch (e.target.className) {
                case 'btn_play':
                    _this.videoPlayer.get(0).play();
                    clearInterval(_this.timer);
                    _this.timerFn();
                    break;
                case 'btn_pause':
                    _this.videoPlayer.get(0).pause();
                    clearInterval(_this.timer);
                    break;
                case 'btn_fullScreen':
                    if ($(this).text() == '全屏') {
                        _this.videoWrap.addClass('fullScreen');
                        _this.videoPlayer.addClass('fullScreen');
                        $(this).text('还原');
                    }
                    else {
                        _this.videoWrap.removeClass('fullScreen');
                        _this.videoPlayer.removeClass('fullScreen');
                        $(this).text('全屏')
                    }
                    break;
            }
        });
        //音量控制
        $lessVoice.on('click', function (e) {
            var volume = _this.videoPlayer.get(0).volume;
            volume = (volume - 0.1).toFixed(1);
            if(volume<=0){
                volume=0;
            }
            _this.videoPlayer.get(0).volume = volume;
            console.log(_this.videoPlayer.get(0).volume);
            _this.videoWrap.find('.voice_control').height(_this.videoWrap.find('.btn_voice').height()*volume)
        });
        $moreVoice.on('click', function (e) {
            var volume = _this.videoPlayer.get(0).volume;
            volume = (volume + 0.1).toFixed(1);
            if(volume>=1){
                volume=1;
            }
            _this.videoPlayer.get(0).volume = volume;
            console.log(_this.videoPlayer.get(0).volume);
            _this.videoWrap.find('.voice_control').height(_this.videoWrap.find('.btn_voice').height()*volume)
        })
    };
    VideoPlay.prototype.timerFn = function () {
        console.log(this);
        var _this = this;
        _this.timer = setInterval(function () {
            _this.store.currentTime++;
            if (_this.store.currentTime >= Math.ceil(_this.store.duration)) {
                clearInterval(this.timer);
            }
            _this.unit.scrollBarFn(_this.videoWrap, _this.store);
        }, 1000);

    }

})(window);


function Unit() {

}

//格式化视频时长
Unit.prototype.formateTime = function (second) {
    var timeArr = [];
    if (second > 3600) {
        if (second >= 3600 * 10) {
            timeArr.push(Math.floor(second / 3600))
        } else {
            timeArr.push('0' + Math.floor(second / 3600))
        }
        timeArr.push('00').push('00');
    } else if (second > 60) {
        timeArr.push('00');
        if (second >= 60 * 10) {
            timeArr.push(Math.floor(second / 60))
        } else {
            timeArr.push('0' + Math.floor(second / 60))
        }
        if ((second % 60) > 10) {
            timeArr.push(Math.ceil(second % 60))
        } else {
            timeArr.push('0' + Math.ceil(second % 60))
        }
    } else {
        timeArr.push('00');
        timeArr.push('00');
        timeArr.push(Math.ceil(second));
    }
    return timeArr;
};

//生成进度条
Unit.prototype.scrollBarFn = function ($obj, store) {
    var $scrollPoint = $obj.find('.processBar_scrollPoint'),
        $processBar_bg = $obj.find('.processBar_bg'),
        pointWidth = (store.currentTime / store.duration) * $processBar_bg.width();
    pointWidth = Math.ceil(pointWidth);
    $scrollPoint.css('width', pointWidth + 'px');
    console.log(pointWidth);
}