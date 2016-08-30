import Player from './player';
module.exports = function () {
    const player = new Player({
        containerId: 'player',
        enableSensorControl: false,
        isOnStereoMode: false
    });

    player.loadVideo('/output.mp4');
    player.play();
};
