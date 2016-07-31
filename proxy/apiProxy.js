var http = require('http'),
    httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});

var target = "134.213.113.137:9000";

proxy.on('proxyReq', function(proxyReq) {
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Host', target);
});

var server = http.createServer(function(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');

    proxy.web(req, res, {
        target: 'http://' + target + "/v1/products"
    });

});

console.log("listening on port 5050");
server.listen(5050);