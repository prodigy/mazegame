/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - FloorTile
 */

// MazeTile
(function(){
    MazeGame.Tiles.FloorTile = function(maze, posX, posY){
        MazeGame.Tiles.MazeTile.call(this, maze, posX, posY);
        this.isWalkable = true;
        this._className += ' tile-floor';
        this.tileName = 'floor';
    };

    MazeGame.Tiles.FloorTile.prototype = Object.create(MazeGame.Tiles.MazeTile.prototype);
    MazeGame.Tiles.FloorTile.prototype.constructor = MazeGame.Tiles.FloorTile;
})();