/**
 * Created by yong on 8/27/16.
 */
var express = require('express');
var app = express();

var ROOT = __dirname;

console.log(ROOT);

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(ROOT + '/demo.html');
});

app.get('/api/video_meta', function (req, res) {
    res.sendFile(ROOT + '/data.json');
});

var port = 8000;

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});
