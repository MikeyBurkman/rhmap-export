
export interface Config {
    readonly host: string;
    readonly appkey: string;
    readonly userkey: string;
    readonly collection: string;
    readonly query?: any
}

const config: Config = {
    host: 'https://foo.feedhenry.com',
    appkey: '123456789',
    userkey: '987654321',
    collection: 'collectionName',
    query: { // Query is optional
        eq: {
            status: 'processed'
        }
    }
};

export default config;