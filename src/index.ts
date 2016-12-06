
import 'source-map-support/register';

import * as request from 'request-promise';
import config from './config';
import * as Promise from 'bluebird';

function query(skip: number, limit: number): Promise<any[]> {
    const url = config.host + '/mbaas/db';
    const body = {
        act: 'list',
        type: config.collection,
        limit: limit,
        skip: skip,
        __fh: {
            appkey: config.appkey,
            userkey: config.userkey
        }
    };

    var req = request.post({
        uri: url,
        body: body,
        json: true
    });

    return Promise.resolve(req)
        .then(res => res.list);
}

function getNext(results: any[] = [], limit: number = 20, skip: number = 0): Promise<any[]> {
    return query(skip, limit).then(resp => {
        results = results.concat(resp);
        if (resp.length < limit) {
            // Done!
            return results;
        } else {
            return getNext(results, limit, skip + limit);
        }
    });
}

getNext()
    .then(res => res.map(r => r.fields.name))
    .then(res => JSON.stringify(res, null, 2))
    .then(console.log)
    .catch(err => {
        // Crash process!
        throw err;
    });