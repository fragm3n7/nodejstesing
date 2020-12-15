export default class HttpHeader {
    static configure(request, response, next) {
        // HttpHeader.set(response, 'Content-Security-Policy', 'default-src *; script-src \'self\'');
        HttpHeader.set(response, 'X-XSS-Protection', '1; mode=block');
        HttpHeader.set(response, 'Strict-Transport-Security', 'max-age=31536000; preload');
        HttpHeader.set(response, 'X-Frame-Options', 'SAMEORIGIN');
        HttpHeader.set(response, 'X-Content-Type-Options', 'nosniff');
        // HttpHeader.set(response, 'Feature-Policy', 'autoplay \'none\'; canera \'none\'');
        HttpHeader.remove(response, 'X-Powered-By');
        next();
    }
    ;
    static set(response, headerKey, headerValue) {
        response.header(headerKey, headerValue);
    }
    ;
    static remove(response, headerKey) {
        response.removeHeader(headerKey);
    }
    ;
}
;