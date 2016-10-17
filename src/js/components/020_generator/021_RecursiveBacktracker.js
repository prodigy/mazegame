/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - RecursiveBacktracker
 */

MazeGame.Generators = MazeGame.Generators || {};

(function(){
    MazeGame.Generators.RecursiveBackTracker = {};
    MazeGame.Generators.RecursiveBackTracker.generateMaze = function (game, width, height, onTileCreated, onDeadEnd, onFinished) {
        var maze = game.maze;

        var posX = 1;
        var posY = 1;

        var i, j;
        var tile;

        var visited = [[]];
        for(i = 0; i < maze.width; i++){
            if(!visited[i])
                visited[i] = [];

            for(j = 0; j < maze.height; j++){
                visited[i][j] = false;
            }
        }
        visited[posX][posY] = true;
        maze.setTile(new MazeGame.Tiles.FloorTile(maze, posX, posY));

        var stack = [];
        stack.push({x: posX, y: posY});

        // Generate maze.
        while(stack.length) {
            tile = maze.getTile(posX, posY);

            var possibleDirs = [];
            for(var possibleDir in MazeGame.Direction.getValues()) {
                if(!MazeGame.Direction.hasOwnProperty(possibleDir))
                    continue;

                var nb = tile.getNeighbour(possibleDir);
                if (nb)
                    nb = nb.getNeighbour(possibleDir);
                if (nb && !visited[nb.posX][nb.posY])
                    possibleDirs.push(possibleDir);
            }
            if (possibleDirs.length){
                var dir = MazeGame.Direction[MazeGame.Direction[possibleDirs[randInt(0, possibleDirs.length)]]];
                switch(dir){
                    case MazeGame.Direction.Down:
                        visited[posX][posY+1] = visited[posX][posY+2] = true;
                        maze.setTile(new MazeGame.Tiles.FloorTile(maze, posX, posY+1));
                        maze.setTile(new MazeGame.Tiles.FloorTile(maze, posX, posY+2));
                        posY += 2;
                        break;
                    case MazeGame.Direction.Left:
                        visited[posX-1][posY] = visited[posX-2][posY] = true;
                        maze.setTile(new MazeGame.Tiles.FloorTile(maze, posX-1, posY));
                        maze.setTile(new MazeGame.Tiles.FloorTile(maze, posX-2, posY));
                        posX -= 2;
                        break;
                    case MazeGame.Direction.Right:
                        visited[posX+1][posY] = visited[posX+2][posY] = true;
                        maze.setTile(new MazeGame.Tiles.FloorTile(maze, posX+1, posY));
                        maze.setTile(new MazeGame.Tiles.FloorTile(maze, posX+2, posY));
                        posX += 2;
                        break;
                    case MazeGame.Direction.Up:
                        visited[posX][posY-1] = visited[posX][posY-2] = true;
                        maze.setTile(new MazeGame.Tiles.FloorTile(maze, posX, posY-1));
                        maze.setTile(new MazeGame.Tiles.FloorTile(maze, posX, posY-2));
                        posY -= 2;
                        break;
                }
                if(isFunction(onTileCreated))
                    onTileCreated.call(game, posX, posY);

                stack.push({x: posX, y: posY});
            } else {
                if(isFunction(onDeadEnd))
                    onDeadEnd.call(game, posX, posY);

                var back = stack.pop();
                posX = back.x;
                posY = back.y;
            }
        }

        // Set entry and exit.
        maze.setTile(new MazeGame.Tiles.FloorTile(maze, 1, 0));
        // Set exit tile.
        var exitTile = new MazeGame.Tiles.FloorTile(maze, maze.width-2, maze.height-1);
        exitTile.onTileEnter = function () {
            while(game.playersWrapper.firstChild) {
                game.playersWrapper.removeChild(game.playersWrapper.firstChild);
            }
            while(game.entitiesWrapper.firstChild) {
                game.entitiesWrapper.removeChild(game.entitiesWrapper.firstChild);
            }
            while(game.tilesWrapper.firstChild) {
                game.tilesWrapper.removeChild(game.tilesWrapper.firstChild);
            }

            game.remove();
            game = new MazeGame.Game(game.width, game.height);
        };
        maze.setTile(exitTile);

        maze._entryPoint = new MazeGame.Position(1, 0);
        maze._exitPoint = new MazeGame.Position(maze.width-2, maze.height-1);

        // Update wall tiles to use the right texture.
        for(i = 0; i < maze.width; i++){
            for(j = 0; j < maze.height; j++){
                tile = maze.getTile(i, j);
                if(typeof tile.type !== 'undefined') {
                    var neighbours = tile.getNeighbours('wall');
                    var type = '';
                    if(neighbours[MazeGame.Direction.Up])
                        type += 'u';
                    if(neighbours[MazeGame.Direction.Left])
                        type += 'l';
                    if(neighbours[MazeGame.Direction.Right])
                        type += 'r';
                    if(neighbours[MazeGame.Direction.Down])
                        type += 'd';
                    if (type === '')
                        type = 'single';
                    var tileType = MazeGame.Tiles.MazeTile.Types[type];
                    tile.setType(tileType);
                }
            }
        }

        if (isFunction(onFinished))
            onFinished.call(game);

        return maze;
    }
})();