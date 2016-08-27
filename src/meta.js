
var metaData = [{"currentIndex":0,"paths":[{"atv":0.0,"ath":0.0,"starttime":0,"endtime":125}],"modlePos":{"atv":0.0,"ath":360.0}];

function getCurrentMeta(curTime) {
    var curIndex = 1 + curTime % 125;
    return metaData[curIndex];
}

function posToUV(atv, ath) {
    var v = ath / 360.0;
    var u = (90.0 - atv) / 180.0;
    return {'v': v, 'u': u};
}