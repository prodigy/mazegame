/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - 001_AnimatedTexture
 */

// Animated Texture
(function () {
    MazeGame.Textures.AnimatedTexture = function (textureClass, frameKeys) {
        MazeGame.Textures.Texture.call(this, textureClass);
        this.textureType = 'animated';

        if (isArray(frameKeys))
            this.frameKeys = frameKeys;
        else
            this.frameKeys = [frameKeys];
    };
    MazeGame.Textures.AnimatedTexture.prototype = Object.create(MazeGame.Textures.Texture);
    MazeGame.Textures.AnimatedTexture.prototype.getFrame = function (idx) {
        if (typeof this.frameKeys[idx] !== 'undefined')
            return this.textureClass + this.frameKeys[idx];
    };
    MazeGame.Textures.AnimatedTexture.prototype.constructor = MazeGame.Textures.AnimatedTexture;
})();