/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - 001_Texture
 */

var MazeGame = window.MazeGame || {};
MazeGame.Textures = MazeGame.Textures || {};

// Texture
(function () {
    MazeGame.Textures.Texture = function (textureClass) {
        this.textureClass = textureClass;
        this.textureType = 'static';
    };

    MazeGame.Textures.Texture.prototype = {};
    MazeGame.Textures.Texture.prototype.constructor = MazeGame.Textures.Texture;
})();