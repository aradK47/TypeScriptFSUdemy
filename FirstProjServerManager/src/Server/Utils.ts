import {parse, Url,  UrlWithParsedQuery} from 'url'

export class Utils {

    // static method , args are url of type string or undefind, (cleaner code because we might not get url from Server.ts)
    public static getUrlBasePath(url:string | undefined): string {
        // if the url is exists (not null or undefind)
        if (url) {
            // parsing it using an imported method from 'url' module
            const parsedUrl = parse(url);
            // returning the base path for example if the url is: localhost:8080/data it will return 'data'
            return parsedUrl.pathname!.split('/')[1]
        }
        return "";
    }

    public static getUrlParameters(url:string | undefined): UrlWithParsedQuery | undefined{
        if (url) {
            return parse(url,true)
        } else {
            return undefined;
        }
    }

}