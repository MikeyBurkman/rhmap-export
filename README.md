# rhmap-export
CLI for exporting from RHMAP Mongo Databases

### Instructions
1. Run `npm i` to install all dependencies
2. Edit `src/config.ts` to have the settings you need.
  - `host` is the `Current Host` for your project/mbaas as given in App Details
  - `appkey` comes from the `API App Key` in App Details
  - `userkey` is best found by opening dev tools in the browser when running a query in the databrowser. Inspect the body for the request (the url ends in `/mbaas/db`) and look at the `__fh` object.
  - `collection` is the name of the collection you're querying
  - TBD: Adding query parameters
3. Run `npm run export` to start the export process. It will print the JSON array of records to stdout.
