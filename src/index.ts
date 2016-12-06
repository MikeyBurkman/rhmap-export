
import 'source-map-support/register';

import * as fs from 'fs';
import * as request from 'request-promise';
import config from './config';
import * as Promise from 'bluebird';

function convertRecord(record: any) {
    const r: any = record.fields;
    r._id = record.guid;
    return r;
}

function query(skip: number, limit: number): Promise<any[]> {
    const url = config.host + '/mbaas/db';
    const body: any = {
        act: 'list',
        type: config.collection,
        limit: limit,
        skip: skip,
        __fh: {
            appkey: config.appkey,
            userkey: config.userkey
        }
    };

    if (config.query) {
        const q = config.query;
        Object.keys(q).forEach(queryName => {
            body[queryName] = q[queryName];
        });
    }

    if (config.returnFields) {
        body.fields = config.returnFields;
    }

    var req = request.post({
        uri: url,
        body: body,
        json: true
    });

    return Promise.resolve(req)
        .then(res => res.list)
        .then(res => res.map(convertRecord));
}

function getNext(results: any[] = [], limit: number = 20, skip: number = 0): Promise<any[]> {
    return query(skip, limit).then(resp => {
        const newResults = results.concat(resp);
        if (resp.length < limit) {
            // Done!
            return newResults;
        } else {
            return getNext(newResults, limit, skip + limit);
        }
    });
}

function writeToOutputFile(results: any[]) {
    const s = config.prettyPrint ? 
        JSON.stringify(results, null, 2) :
        JSON.stringify(results);
    return Promise.fromCallback(cb => fs.writeFile(config.outputFile, s, cb));
}

(function() {
    // Just log the length -- mostly for testing
    getNext()
        .then(res => console.log('Length: ', res.length))
        .catch(err => {
            // Crash process!
            throw err;
        });
});

(function() {
    // Get the actual records
    getNext()
        .then(writeToOutputFile)
        .then(() => console.log('Finished'))
        .catch(err => {
            // Crash process!
            throw err;
        });
})();