/**
 * Copyright (c) 2016 by Sebastian Grunow <sebastian@grunow-it.de>
 *
 * MazeGameHTML
 * - Direction
 */

var MazeGame = window.MazeGame || {};

/**
 * MazeGame.Direction
 */
(function(){
    MazeGame.Direction = createEnum(['Left', 'Up', 'Right', 'Down']);
})();