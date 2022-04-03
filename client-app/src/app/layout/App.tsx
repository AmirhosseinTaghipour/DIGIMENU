import React, { useEffect, Fragment, useContext, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import LoadingComponent from "./LoadingComponent";
import "./styles.css";
import "./colorStyle.css";
import { observer } from "mobx-react-lite";
import {
    Route,
    withRouter,
    RouteComponentProps,
    Switch,
    Redirect,
} from "react-router-dom";
import { RootStoreContext } from "../stores/rootStore";
import { ConfigProvider } from "antd";
import faIR from "antd/es/locale/fa_IR";

//import ShortUrl from "../../features/common/ShortUrl/ShortUrl";
import UnAuthorized from "../../features/unauthorized/UnAuthorizedPage";
import { Manager } from "browser-detect-devtools";
import RegisterForm from "../../features/user/RegisterForm";


// React.lazy
const NotFound = React.lazy(() => import('./NotFound'));
const LoginForm = React.lazy(() => import('../../features/user/LoginForm'));
const Dashboards = React.lazy(() => import('../../features/main/Dashboard'));
const ChangePassword = React.lazy(() => import('../../features/user/ChangePassword'));
const ForgotPassword = React.lazy(() => import('../../features/user/ForgotPassword'));



const App: React.FC<RouteComponentProps> = ({ location, match }) => {
    if (!window.location.origin.includes("localhost:3000") && !window.location.origin.includes("localhost:1082")) {
        Manager.alwaysConsoleClear(true);
        Manager.freezeWhenDevToolsOpened(true);
        document.addEventListener("contextmenu", (event) => event.preventDefault());
        document.onkeydown = function (e) {
            // disable F12 key
            if (e.keyCode == 123) {
                return false;
            }

            // disable I key
            if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
                return false;
            }

            // disable J key
            if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
                return false;
            }

            // disable J key
            if (e.ctrlKey && e.shiftKey && e.keyCode == 75) {
                return false;
            }

            // disable U key
            if (e.ctrlKey && e.keyCode == 85) {
                return false;
            }
        };
    }

    const rootStore = useContext(RootStoreContext);
    const { token, appLoaded, setAppLoaded } = rootStore.commonStore;
    const { getUser, isLoggedIn } = rootStore.userStore;

    useEffect(() => {
        if (token)
            getUser().finally(() => setAppLoaded());
        else
            setAppLoaded();
    }, [token]);


    if (!appLoaded)
        return (
            <ConfigProvider direction="rtl" locale={faIR}>
                <LoadingComponent/>
            </ConfigProvider>
        );

    return (
        <ConfigProvider direction="rtl" locale={faIR}>
            <Route exact path="/">
                <Suspense fallback={<LoadingComponent />}>
                    {isLoggedIn && !!token ? (
                        <Redirect to="/dashboard" />
                    ) : (
                        <Redirect to="/login" />
                    )}
                </Suspense>
            </Route>

            <Route
                path={"/(.+)"}
                render={() => (
                    <Fragment>
                        <Suspense fallback={<LoadingComponent />}>
                            <Switch>
                                <Route exact path="/">
                                    {(!!token && isLoggedIn) ? (
                                        <Redirect to="/dashboard" />
                                    ) : (
                                        <Redirect to="/login" />
                                    )}
                                </Route>
                                <Route path="/dashboard" component={Dashboards}>
                                    {!!token && !!isLoggedIn ? <Dashboards /> : <LoginForm />}
                                </Route>
                                <Route path="/login" component={LoginForm}>
                                    {!!token && !!isLoggedIn ? <Dashboards /> : <LoginForm />}
                                </Route>
                                <Route path="/register" component={RegisterForm} />
                                <Route path="/forgotpassword" component={ForgotPassword} />
                                <Route path="/unau/:page/:id" component={UnAuthorized} />
                                {/*<Route path="/su/:type/:shortCode" component={ShortUrl} />*/}
                                <Route component={NotFound} />
                            </Switch>
                        </Suspense>
                    </Fragment>
                )}
            />
            
        </ConfigProvider>
    );
};

export default withRouter(observer(App));
