import React from 'react';
import { AppstoreOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Modal, Image, Alert } from 'antd';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { IFile } from '../../../app/models/common';
//import { IFile } from '../../../app/models/docs';

interface IProps {
    close: () => void;
    file:IFile
}

const FileViewer: React.FC<IProps> = ({ close, file }) => {
    return (
        <Modal
            className="bsModal"
            footer
            title={file.name}
            visible
            onOk={() => close()}
            onCancel={() => close()}
            keyboard={true}
            destroyOnClose
        >
            <div style={{ width: "100%", height: "calc(100vh - 8rem)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Image key="imageViewer" src={`${file.url!}?${Date.now()}`}/>
            </div>
        </Modal>
    );
}

export default FileViewer;

