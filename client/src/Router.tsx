import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import NotFoundPage from './notFound/NotFoundPage'
import Routes from './Routes'
import {TestComponent} from "./test/TestComponent";
import LoginApp from "./login/LoginApp";

export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path={Routes.test()} exact component={TestComponent}/>
                <Route path={Routes.login()} exact component={LoginApp}/>
                <Route component={NotFoundPage}/>
            </Switch>
        </BrowserRouter>
    )
}
