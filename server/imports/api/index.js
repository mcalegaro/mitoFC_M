import {
    Meteor
} from 'meteor/meteor';

import express from 'express';

export function setupApi() {
    const app = express();
    var request = Npm.require('request');
    app.get('/api', (req, res) => {
        var url = req.url.replace('/api?url=', '');
        var mth = req.method;
        var hdr = req.headers;
        delete hdr.host;
        console.info(url);
        var opts = {
            method: mth,
            uri: url,
            headers: hdr
        };
        req.pipe(request(opts)).pipe(res);
    });

    WebApp.connectHandlers.use(app);
}