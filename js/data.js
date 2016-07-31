productService = (function () {

    //Return a product by its ID
    var getById = function (id) {

            for (var index in products) {

            if (products[index].id == id) {

                return requestProduct(index, id).then(function(){

                    return products[index];
                });
            }
        }
    },

    //Return all the products
    getAll = function() {

        return requestList().then(function() {

            return products;
        });
    },

    //Update product details through the Webservice
    updateProduct = function(product) {

        return fetch(constantsService.constants.API_PROXY_URL + product.id + '', {
            method: 'PUT',
            body: JSON.stringify(product)
        }).then(function() {

            products[product.id] = product;
        }).catch(err => console.log(err));
    },

    //Update the products object array from the Webservice
    requestList = function () {

        return fetch(constantsService.constants.API_PROXY_URL, {
            method: 'GET'
        }).then(function(response) {

            return response.json()
        }).then(function(responseJson){

            products = responseJson;
        }).catch(err => console.log(err));
    },

    //Update an individual product in the products object array from the Webservice
    requestProduct = function(index, id) {

        return fetch(constantsService.constants.API_PROXY_URL + id + '', {
            method: 'GET'
        }).then(function(response) {

            return response.json()
        }).then(function(responseJson){

            for (var property in responseJson) {
                if (responseJson.hasOwnProperty(property) && typeof products[index][property] != 'undefined') {

                    products[index][property] = responseJson[property];
                }
            }

        }).catch(err => console.log(err));
    },

    //Request a relevant image from the FLICKR API and return the image URL
    requestImage = function(product) {

        return fetch(constantsService.constants.FLICKR_API_URL + '' +
        '?method='+ constantsService.constants.FLICKR_API_METHOD + '' +
        '&api_key=' + constantsService.constants.FLICKR_API_KEY + '' +
        '&format=json' +
        '&nojsoncallback=1' +
        '&text=' + product.name +
        '&per_page=1' +
        '&safe_search=1' +
        '&sort=relevance' +
        '&page=1', {
            method: 'GET'
        }).then(function(response) {

            return response.json()
        }).then(function(responseValue){

            var photo = responseValue.photos.photo[0];

            return 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';

        }).catch(err => console.log(err));
    },

    //The products object array
    products = [];

    // The public API
    return {
        getById: getById,
        getAll: getAll,
        requestImage: requestImage,
        updateProduct: updateProduct
    };

}());