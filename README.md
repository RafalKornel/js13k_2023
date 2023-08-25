# XIII Century (temp name)

This project is a game created for [js13kGames contest](https://js13kgames.com/)

# TODO
- [x] canvas rendering and basic infrastructure
- [x] assets compiler and image decoder
- [x] scene manager, scenes with connections (portals, doors)
- [ ] dialogue / interaction system
- [ ] game state / decision tree system
- [ ] content

# Build

### Install dependencies:
``` bash
yarn
```

### Build project:
``` bash
yarn build
```

### Modify `dist/index.html` file: 
``` diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + TS</title>
-    <script type="module" crossorigin src="/assets/bundled-file.js"></script>
  </head>
  <body>
    <div id="app">
      <canvas id="game"></canvas>
      <canvas id="text"></canvas>
    </div>
    
  </body>
  <style>
    canvas {
      position: absolute;
      width: calc(100vh * 4 / 3);
      height: 100%;
      image-rendering: pixelated;
    }
  </style>
+ <script src="assets/bundled-file.js"></script>
</html>
```

This step is necessary for ability to run project from file (not only from server)

TODO: maybe find a better way to handle this?

### Compress files:
``` bash
yarn compress
```

This will create `dist.zip` file - this file should be submitted to js13k contest