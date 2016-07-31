//Navigation/Header component
var Header = React.createClass({

    render: function () {

        return (
            <header className="bar bar-nav">
                <a href="#" className={"icon icon-left-nav pull-left" + (this.props.back==="true"?"":" hidden")}></a>
                <h1 className="title">{this.props.text}</h1>
            </header>
        );
    }
});

//Product List Item component
var ProductListItem = React.createClass({

    render: function () {

        return (
            <li className="table-view-cell media">
                <a href={"#product/" + this.props.product.id}>
                    <img className="media-object small pull-left" src={this.props.product.imageUrl}/>
                    {this.props.product.name}
                    <p>{this.props.product.description}</p>
                    <p>{this.props.product.amount}</p>
                </a>
            </li>
        );
    }
});

//Product List component
var ProductList = React.createClass({

    getInitialState: function() {

        return { products: this.props.products };
    },

    componentDidMount: function() {

        var self = this;

        //Get all current products
        productService.getAll().then(function(products) {

            return self.setState({
                products: products
            });

        //If product does not already have an image, we request one through the product service
        }).then(function() {

            var products = self.state.products;

            self.state.products.map(function (product, key) {

                if(typeof product.imageUrl == 'undefined' || product.imageUrl == null) {

                    productService.requestImage(product).then(function (imageUrl) {

                        product.imageUrl = imageUrl;
                        products[key] = product;

                        self.setState({products: products});
                    });
                }
            });
        });
    },

    render: function () {

        if(Object.keys(this.state.products).length !== 0) {

            var items = this.state.products.map(function (product) {

                if (product.imageUrl) {

                    return (
                        <ProductListItem key={product.id} product={product} />
                    );
                }
            });

            return (
                <ul className="table-view">
                {items}
                </ul>
            );
        } else {

            return (
                <p>Loading List...</p>
            );
        }
    }
});

//App Landing Page component
var HomePage = React.createClass({

    render: function () {

        return (
            <div className={"page " + this.props.position}>
                <Header text="Product List" back="false"/>
                <div className="content">
                    <ProductList products={this.props.products}/>
                </div>
            </div>
        );
    }
});

//Individual Product component
var ProductPage = React.createClass({

    getInitialState: function() {
        return {product: {}};
    },

    componentDidMount: function() {
        this.props.service.getById(this.props.productId).then(function(result) {

            this.setState({product: result});
        }.bind(this));
    },

    //Update the product through the web service and redirect
    saveChange: function(event) {

        productService.updateProduct(this.state.product).then(function() {

            router.load('')
        });
    },

    //Update local state object with current input value
    handleChange: function(event) {

        var updatedState = {product: this.state.product};
        updatedState.product[event.target.name] = event.target.value;
        this.setState(updatedState);
    },

    render: function () {

        return (
            <div className={"page " + this.props.position}>
                <Header text="Product" back="true"/>
                <div className="card">
                    <ul className="table-view">
                        <li className="table-view-cell media">
                            <img className="media-object big" src={this.state.product.imageUrl}/>
                            <div class="content-padded">
                                <p>Name</p><input
                                    type="text"
                                    name="name"
                                    value={this.state.product.name}
                                    onChange={this.handleChange}
                                />
                                <p>Description</p><input
                                    type="text"
                                    name="description"
                                    value={this.state.product.description}
                                    onChange={this.handleChange}
                                />
                                <p>Amount</p><input
                                type="text"
                                name="amount"
                                value={this.state.product.amount}
                                readonly
                                />
                                <button className="btn btn-primary" onClick={this.saveChange}>Save Changes</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
});

var App = React.createClass({

    mixins: [PageSlider],

    getInitialState: function() {

            return {products: {}}

    },

    componentDidMount: function() {

            router.addRoute('', function() {
                this.slidePage(<HomePage key="list" products={this.state.products}/>);
            }.bind(this));
            router.addRoute('product/:id', function(id) {
                this.slidePage(<ProductPage key="details" productId={id} service={productService}/>);
            }.bind(this));
            router.start();
    }
});

React.render(<App/>, document.body);