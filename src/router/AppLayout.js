import React, { Component } from 'react';
import Index from '../page/index/index';
import Show from '../page/show/show';
import { HashRouter,Route, Switch } from 'react-router-dom';

// import loadable from "../common/loadable";
//
// const Index = loadable(() => import('../page/index/index'));
// const Show = loadable(() => import('../page/show/show'));

class AppLayout extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path='/edit/:id/:token' exact component={Index} />
                    <Route path='/show/:id/:token' exact component={Show} />
                    <Route path='/window/:id/:token/:websocketId' exact component={Show} />
                    <Route path='/show/:id/:token/:roadId' exact component={Show} />
                    <Route path='/edit/:id/:token/:roadId' exact component={Index} />
                </Switch>
            </HashRouter>
        );
    }
}

export default AppLayout;