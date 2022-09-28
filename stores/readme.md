### Directory structure explanation for 'stores' directory:

1. Each page will have its own store
2. The structure of 'stores' directory is exacly the same as in 'pages' directory
3. Atoms in stores/index.ts is used in pages/index.ts, atoms in stores/tickets/index.ts is used in pages/tickets/index.ts, and so on..

### Other notes:

1. Globally used state such as current active semester are stored in /atom.ts
2. Jotai is the state management library used in this project
