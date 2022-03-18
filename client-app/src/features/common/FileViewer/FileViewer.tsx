import React from 'react';
import { AppstoreOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Modal, Image, Alert } from 'antd';
import LoadingComponent from '../../../app/layout/LoadingComponent';
//import { IFile } from '../../../app/models/docs';

interface IProps {
    isVisible: boolean;
    close: () => void;
    //file: IFile
    file: any

}

const FileViewer: React.FC<IProps> = ({ isVisible, close, file }) => {

    const fileTypes = ["pdf", "jpg", "jpeg", "png", "bmp", "gif"];

    if (!file || !isVisible) { return <LoadingComponent /> }

    return (

        <Modal
            className="customModal"
            footer={[
                <Button
                    size="middle"
                    key="downloadImageButton"
                    href={file.fileSrc!}
                    type="primary"
                    download={file.fileName && file.fileName.length > 0 ? file.fileName : "image"}
                    icon={<DownloadOutlined />}
                >
                    دریافت فایل
                </Button>,
                <Button
                    key="closeButton"
                    type="default"
                    icon={<CloseOutlined />}
                    onClick={close}

                >بستن</Button>
            ]}
            // width="calc(100% - 100px)"
            style={{
                position: "absolute",
                top: "0.3rem",
                right: window.innerWidth < 1025 ? "0.1rem" : "2rem",
                // left: "2rem",
            }}


            title={
                <div style={{ fontSize: ".8em" }}>
                    <AppstoreOutlined

                        style={{
                            fontSize: "1.1rem",
                            top: "0.1rem",
                            position: "relative",
                            marginLeft: window.innerWidth < 1025 ? "0.1rem" : "0.5rem",
                            color: "#48dbfb",
                        }}
                    />
                    {file.docTypeTitle}
                </div>
            }
            visible={isVisible}
            onOk={() => close()}
            onCancel={() => close()}

            width={window.innerWidth < 1024 ? "100%" : "calc(100% - 4rem)"}

            keyboard={true}
            bodyStyle={{
                padding: 0,
                minHeight: 100,
                textAlign: "center",
                height: "calc(100vh - 8rem)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
            destroyOnClose
            zIndex={1000}

        >
            {
                fileTypes.findIndex(x => x == file.fileType) > -1 ?
                    fileTypes.findIndex(x => x == file.fileType) > 0 ?
                        <Image key="imageViewer" width="inherit" height="inherit" src={file.fileSrc!} /> :
                        /* <iframe key="fileViewer" width="inherit" height="inherit" src={ file.fileSrc! } /> :*/

                        <object data={file.fileSrc!} type={`application/${file.fileType}`} width="100%" height="100%">
                            <Alert
                                style={{ fontWeight: 'bold', textAlign: "right" }}
                                message={<h3 >عدم نمایش فایل</h3>}
                                description={<ul style={{ listStyleType: "circle" }}><li>مرورگر شما پلاگین مخصوص نمایش نوع {file.fileType?.toUpperCase()} را ندارد</li><li>برای دانلود فایل می توانید کلید دریافت فایل را بزنید</li></ul>}
                                type="warning"
                                showIcon
                            />

                        </object> :

                    "این نوع فایل قابل نمایش نمی باشد!"
            }
        </Modal>

    );
}

export default FileViewer;

