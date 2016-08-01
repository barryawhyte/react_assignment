# react_assignment

## Description

A simple product listing allowing viewing and editing of certain individual products.

## Features

- List all existing products.
- See the details of one product.
- Modify a product description, or name
- Display pictures in thumbnails (in the list) or larger format (in the description)

## Technical overview

A React based SPA that consumes a RESTful Webservice through a Node JS API Proxy.
Image assets are obtained from the Flickr public API.
Styling and responsive design is facilitated by the Ratchet framework

## API Proxy

I used an API Proxy to avoid CORS issues. The product API requires a content-type header
to be sent on every request, and while this is fine for GET & PUT, the addition of this
header causes a preflight (OPTIONS) request to be sent first. The headers of this preflight
request cannot be set therefore disallowing a successful response due to the absence of the
content-type header. The proxy should be running on the same host as the client application.
Node JS is required to run the API proxy and it can be started from the application root with:

`node proxy/apiProxy.js`

## Installation

The app requires a running web server.
- Create a new directory in the web root
- Copy or clone files into this directory
- [Install nodeJS if not already installed](https://howtonode.org/how-to-install-nodejs)
- From the project root run the command `node proxy/apiProxy.js` to start the API proxy server
- Open a browser and point it to http://localhost/project_directory

If you have configured a Vhost and are accessing the client application from a system other than the web server itself, you will need to set the API_PROXY_URL constant in the js/constants.js file in the source code to that of your web server virtual host name. Keep the port set to 5050.

## Notes

- I checked node_modules in so there is no need to run npm install
- The images are not great but it seems they are the best the FLICKR API can provide, even with
sort set to relevance
