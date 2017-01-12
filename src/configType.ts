
/* Possible query restriction types:
  "eq" - is equal to
  "ne" - not equal to
  "lt" - less than
  "le" - less than or equal
  "gt" - greater than
  "ge" - greater than or equal
  "like" Match some part of the field. Based on [Mongo regex matching logic](http://www.mongodb.org/display/DOCS/Advanced+Queries#AdvancedQueries-RegularExpressions)
  "in" - The same as $in operator in MongoDB, to select documents where the field (specified by the _key_) equals any value in an array (specified by the _value_)
*/
interface Config {
    readonly host: string;
    readonly appkey: string;
    readonly userkey: string;
    readonly collection: string;
    readonly outputFile?: string;
    readonly prettyPrint?: boolean;
    readonly query?: {
        eq?: any;
        ne?: any;
        lt?: any;
        le?: any;
        gt?: any;
        ge?: any;
        like?: any;
        in?: any;
    };
    readonly sort?: { [field: string]: 1|-1 };
    readonly returnFields?: string[];
    readonly countOnly?: boolean;
}

export default Config;