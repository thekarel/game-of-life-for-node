# GAME OF LIFE IN JAVASCRIPT FOR NODE.JS
(c) 2013  [Charles Szilagyi](http://linkd.in/1dNtFS5) | <k@isr.hu> | [Repo at BitBucket](https://bitbucket.org/thekarel/game-of-life-for-node/overview)

For rules and background, see the [LifeWiki](http://conwaylife.com/wiki/Conway%27s_Game_of_Life)

## How to run:

    git clone https://bitbucket.org/thekarel/game-of-life-for-node.git
    cd game-of-life-for-node
    node index.js

You can configure the initial size of the animation in index.js. At the moment, there is no way to set the seed.

![](https://bitbucket.org/thekarel/game-of-life-for-node/raw/3b5dfb7ea6c9bda88a4e98af550d40db82204ae6/GoL.gif)

Logo for the repo is from [DevinatArt](http://mientefuego.deviantart.com/art/Carbon-Glider-129268523)

## Short GoL Summary:

The universe of the Game of Life is an infinite two-dimensional orthogonal
grid of square cells, each of which is in one of two possible states, live
or dead. Every cell interacts with its eight neighbours, which are the
cells that are directly horizontally, vertically, or diagonally adjacent.
At each step in time, the following transitions occur:

  * Any live cell with fewer than two live neighbours dies, as if by needs caused by underpopulation.

  * Any live cell with more than three live neighbours dies, as if by overcrowding.

  * Any live cell with two or three live neighbours lives, unchanged, to the next generation.

  * Any dead cell with exactly three live neighbours cells will come to life.

