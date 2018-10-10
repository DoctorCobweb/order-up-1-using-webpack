# electron app using react and webpack . 
native deps go in ./app/package.json as dependencies . 
all other dependencies (dev also) go in ./package.json . 
  
  to get started
  1. run 'yarn' at base of project
  1.1 'yarn add <native-dependency> in ./app folder. (gets rebuilt automatically via electron-rebuild)
  2. you must run 'yarn dev:renderer' first to generate renderer bundle(s) and 
  respective html templates
  3. then run 'yarn dev:main' to bundle main-process electron file
  4. then 'yarn dev:electron'

no dev server implemented yet, or build/packaging of electron app
