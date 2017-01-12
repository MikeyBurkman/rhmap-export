
import 'source-map-support/register';

import * as fs from 'fs';
import * as request from 'request-promise';
import config from './config';
import * as Promise from 'bluebird';

function convertRecord(record: any) {
    if (config.countOnly) {
        return record;
    }

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

    if (config.countOnly) {
        body.fields = ['_id']; // Can ignore everything else
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

function outputResults(results: any[]): Promise<number> {
    if (config.countOnly) {
        // We log the number of results at the end anyways
        return Promise.resolve(results.length);
    }

    const s = JSON.stringify(results, null, config.prettyPrint ? 2 : undefined);
    if (config.outputFile) {
        const file = config.outputFile;
        return Promise.fromCallback(cb => fs.writeFile(file, s, cb))
            .then(() => results.length);
    } else {
        console.log(s);
        return Promise.resolve(results.length);
    }
}

// Execute the query
getNext()
    .then(outputResults)
    .then(numResults => console.log(`Finished\n${numResults} results`))
    .catch(err => {
        // Crash process!
        throw err;
    });