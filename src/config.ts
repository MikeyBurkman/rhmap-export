
import Config from './configType';

const config: Config = {
    host: 'https://foo.feedhenry.com',
    appkey: '123456789',
    userkey: '987654321',
    collection: 'collectionName',
    outputFile: 'results.json',
    prettyPrint: true,
    query: {
        eq: {
            status: 'processed',
            ticketId: '40111'
        }
    },
    returnFields: ['ticketId']
};

export default config;