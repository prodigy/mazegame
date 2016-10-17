/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - testMaze
 */

(function(){
    function assert(condition, message) {
        if (!condition){
            message = message || "Assertion failed.";
            if (typeof Error !== 'undefined')
                message = new Error(message);
            throw message;
        }
    }

    return;

    var sizeX = randInt(3, 20);
    var sizeY = randInt(3, 20);

    function testMaze(maze) {
        // test default tiles.
        var randomTile = maze.getTile(randInt(0, maze.width),randInt(0, maze.height));
        assert(typeof randomTile !== 'undefined', 'tile is undefined.');
        assert(!randomTile.isWalkable, 'default tile is walkable.');

        var floorTile = new MazeGame.Tiles.FloorTile(null, randInt(1, maze.width-1), randInt(1, maze.height-1));
        maze.setTile(floorTile, floorTile.posX, floorTile.posY);
        assert(maze.getTile(floorTile.posX, floorTile.posY).isWalkable, 'created floor tile is not walkable.');
    }

    // create maze.
    var maze = new MazeGame.Maze(sizeX,sizeY);
    testMaze(maze);

    maze = new MazeGame.Generators.RecursiveBackTracker.generateMaze(sizeX, sizeY);
    testMaze(maze);
})();