import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Alert, Button, notification, Result } from "antd";
import "react-client-captcha/dist/index.css";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import LoadingComponent from "../../../../../app/layout/LoadingComponent";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";


interface IProps {
    id: string;
}

const Paymentcallback: React.FC<RouteComponentProps<IProps>> = ({ match }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        checkPayment,
        checkingPayment,
        paymentResultInfo,
        invalidPayment
    } = rootStore.paymentStore;

    const { id } = match.params;

    const goToDashboard = () => {
        window.history.replaceState(null, "", "/");
        window.location.replace("/");
    }

    useEffect(() => {
        checkPayment(id);
        console.log(id);
    }, [id]);


    if (checkingPayment) {
        return <LoadingComponent content="درحال بررسی پرداخت..." />;
    } else {
        return (
            !!invalidPayment ?
                <Result
                    status="error"
                    title="اطلاعات پرداخت نامعتبر است"
                    extra={[
                        <Button type="primary" key="returnDashboard" onClick={() => goToDashboard()}>
                            برگشت به صفحه اصلی
                        </Button>
                    ]}
                />
                :
                paymentResultInfo.isPaid ?
                    <Result
                        status="success"
                        title="پرداخت موفق"
                        extra={[
                            <Alert
                                message={
                                    <>
                                        <p>پرداخت با موفقیت انجام شد. مشخصات پرداخت به شرح زیر می باشد:</p>
                                        <table
                                            style={{
                                                border: "none",
                                                marginInline: "auto",
                                                textAlign: "left",
                                                paddingInline: "5px"
                                            }}
                                        >
                                            <tr>
                                                <th>مبلغ:</th>
                                                <td>{paymentResultInfo.amount}</td>
                                            </tr>
                                            <tr>
                                                <th>شناسه پرداخت:</th>
                                                <td>{paymentResultInfo.pId}</td>
                                            </tr>
                                            <tr>
                                                <th>کد رهگیری:</th>
                                                <td>{paymentResultInfo.refId}</td>
                                            </tr>
                                            <tr>
                                                <th>تاریخ پرداخت:</th>
                                                <td>{paymentResultInfo.pDate}</td>
                                            </tr>
                                            <tr>
                                                <th>زمان پرداخت:</th>
                                                <td>{paymentResultInfo.pTime}</td>
                                            </tr>
                                        </table>
                                    </>
                                }
                                type="success"
                            />,
                            <br />,
                            <Button type="primary" key="returnDashboard" onClick={() => goToDashboard()}>
                                برگشت به صفحه اصلی
                            </Button>
                        ]}
                    />
                    :
                    <Result
                        status="error"
                        title="پرداخت ناموفق"
                        extra={[
                            <Alert
                                message={paymentResultInfo.message}
                                type="error"
                            />,
                            <br />,
                            <Button type="primary" key="returnDashboard" onClick={() => goToDashboard()}>
                                برگشت به صفحه اصلی
                            </Button>
                        ]}
                    />)
    }
}

export default observer(Paymentcallback);
