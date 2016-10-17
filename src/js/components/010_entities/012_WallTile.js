/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - WallTile
 */

// MazeTile
(function(){
    MazeGame.Tiles.WallTile = function(maze, posX, posY){
        MazeGame.Tiles.MazeTile.call(this, maze, posX, posY);
        this.isWalkable = false;
        this._className += ' tile-wall-';
        this.type = MazeGame.Tiles.MazeTile.Types.ulrd;
        this.tileName = 'wall';
    };

    MazeGame.Tiles.WallTile.prototype = Object.create(MazeGame.Tiles.MazeTile.prototype);
    MazeGame.Tiles.WallTile.prototype.constructor = MazeGame.Tiles.WallTile;

    MazeGame.Tiles.WallTile.prototype.getClassName = function () {
        var name = MazeGame.Tiles.MazeTile.prototype.getClassName.call(this);
        return name + MazeGame.Tiles.MazeTile.Types[this.type];
    }
})();