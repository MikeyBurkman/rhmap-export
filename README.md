# rhmap-export
CLI for exporting from RHMAP Mongo Databases

### Instructions
1. Clone this repo and navigate to its directory
2. Run `npm i` to install all dependencies
3. Edit `src/config.ts` to have the settings you need.
  - `host` is the `Current Host` for your project/mbaas as given in App Details
  - `appkey` comes from the `API App Key` in App Details
  - `userkey` is best found by opening dev tools in the browser when running a query in the databrowser. Inspect the body for the request (the url ends in `/mbaas/db`) and look at the `__fh` object.
  - `collection` is the name of the collection you're querying
  - `outputFile` is the name of the file to write the results to
  - `prettyPrint` is true if you want to format the JSON output
  - `query` is the optional query object, which contains properties like `eq` or `like`. Matches the `$fh.db` docs.
  - `returnFields` is the optional array of fields to bring back. Matches `fields` in the `$fh.db` docs.
4. Run `npm run export` to start the export process

### Caveats
Right now it foolishly loads everything into memory before printing it to stdout. I'll eventually make this event-based and stream records out stdout, 
which should improve performance and not crash if you have a big collection.
