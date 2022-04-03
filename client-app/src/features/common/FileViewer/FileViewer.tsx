import React from 'react';
import { AppstoreOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Modal, Image, Alert } from 'antd';
import LoadingComponent from '../../../app/layout/LoadingComponent';
//import { IFile } from '../../../app/models/docs';

interface IProps {
    close: () => void;
    fileName: string | null;
    fileUrl: string | null;
}

const FileViewer: React.FC<IProps> = ({ close, fileUrl, fileName }) => {
    return (
        <Modal
            className="bsModal"
            footer
            title={fileName!}
            visible
            onOk={() => close()}
            onCancel={() => close()}
            keyboard={true}
            destroyOnClose
            zIndex={1000}
        >
            <div style={{ width: "100%", height: "calc(100vh - 8rem)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Image key="imageViewer" src={fileUrl!} />
            </div>
        </Modal>
    );
}

export default FileViewer;

