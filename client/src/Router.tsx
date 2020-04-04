import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import NotFoundPage from './notFound/NotFoundPage'
import Routes from './Routes'
import {TestComponent} from "./test/TestComponent";
import LoginApp from "./login/LoginApp";
import AdminApp from "./admin/AdminApp";

export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path={Routes.test()} exact component={TestComponent}/>
                <Route path={Routes.login()} exact component={LoginApp}/>
                <Route path={Routes.admin()} exact component={AdminApp}/>
                <Route component={NotFoundPage}/>
            </Switch>
        </BrowserRouter>
    )
}
