import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Button, Upload } from 'antd';
import { DeleteOutlined, PaperClipOutlined, UploadOutlined } from '@ant-design/icons';
/*import { IUploadFile } from '../../../app/models/docs';*/
import { UploadChangeParam } from "antd/lib/upload";
import { IsNullOrEmpty } from '../../../app/common/util/util';
import FileViewer from '../FileViewer/FileViewer';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';

interface IProps {
    name: string;
    relatedObject: object;
    relatedFunction: (input: object) => void;
    propertyName : string;
   /* files : IUploadFile[];*/
    validateField ?: () => void;
}


const FileUploader : React.FC<IProps> = ( { name, relatedFunction, relatedObject, propertyName, /*files,*/ validateField } ) => {
    const map = new Map(Object.entries(relatedObject));

    const rootStore = useContext(RootStoreContext);
   /* const { file, loadFile, loadingFile } = rootStore.docsStore;*/

    const [fileViewerVisible, setFileViewerVisible] = useState(false);

    const closeFileViewer = () => {
        setFileViewerVisible(false);
    }

    const removeFile = () => {
        map.set(propertyName, null);
        const updatedObjesct = Object.fromEntries(map);
        relatedFunction( { ...updatedObjesct } );

        if ( validateField != undefined ) {
            validateField();
        }
    };

    const setFile = (info: UploadChangeParam) => {
        if (info.file.status !== "removed") {
            const blobFile = info.file.originFileObj as Blob
            map.set(propertyName, blobFile);
            const updatedObjesct = Object.fromEntries(map)
            relatedFunction( { ...updatedObjesct } );

            if ( validateField != undefined ) {
                validateField();
            }
        }
    }

    return <Fragment>
        <Upload
            accept={".png, .jpg, .jpeg, .pdf"}
            className="fullWidthUpload"
            multiple={false}
            maxCount={1}
            onChange={(info) => {
                setFile( info );

            }}
            onRemove={() => {
                removeFile();
            }}
        >
            <Button block icon={<UploadOutlined />} >آپلود</Button>
            {/*{files.map((item: IUploadFile) => {*/}
            {/*    if (!IsNullOrEmpty(item?.fileName)) {*/}
            {/*        return (<div key={item.docId} className="ant-upload-list-item ant-upload-list-item-default ant-upload-list-item-list-type-text">*/}
            {/*            <div className="ant-upload-list-item-info">*/}
            {/*                <span className="ant-upload-span">*/}
            {/*                    <Button*/}
            {/*                        style={{ height: "auto", padding: 0 }}*/}
            {/*                        title={`${item.fileName!}`}*/}
            {/*                        onClick={(e) => {*/}
            {/*                            loadFile({*/}
            {/*                                id: item?.docId!,*/}
            {/*                                entityName: item?.entityName!,*/}
            {/*                                docType: item?.docType!*/}
            {/*                            }).then(() => {*/}
            {/*                                setFileViewerVisible(true);*/}
            {/*                            });*/}

            {/*                            e.stopPropagation();*/}
            {/*                        }}*/}
            {/*                        loading={loadingFile}*/}
            {/*                        type="link"*/}
            {/*                        icon={<PaperClipOutlined />}*/}
            {/*                    >*/}
            {/*                        {`${item.fileName!}`}*/}

            {/*                    </Button>*/}
            {/*                    */}{/*<span className="ant-upload-list-item-card-actions" style={ { right: "unset", left: 0, } }>*/}
            {/*                    */}{/*    <Button*/}
            {/*                    */}{/*        title="حذف فایل"*/}
            {/*                    */}{/*        type="link"*/}
            {/*                    */}{/*        danger*/}
            {/*                    */}{/*        onClick={ ( e ) => {*/}
            {/*                    */}{/*            deleteFile( { id: item?.docId!, docType: item?.docType!, entityName: item?.entityName! } )*/}
            {/*                    */}{/*                .then( () => {*/}
            {/*                    */}{/*                    setDeletedFiles( [ ...deletedFiles, {*/}
            {/*                    */}{/*                        docId: item.docId,*/}
            {/*                    */}{/*                        docType: item.docType,*/}
            {/*                    */}{/*                        entityName: item.entityName,*/}
            {/*                    */}{/*                        fileName: item.fileName*/}
            {/*                    */}{/*                    } ] )*/}

            {/*                    */}{/*                } )*/}
            {/*                    */}{/*            e.stopPropagation();*/}
            {/*                    */}{/*        } }*/}
            {/*                    */}{/*        size="small"*/}
            {/*                    */}{/*        loading={ deletingFile }*/}
            {/*                    */}{/*        icon={ <DeleteOutlined /> }*/}
            {/*                    */}{/*    />*/}

            {/*                    */}{/*</span>*/}
            {/*                </span>*/}
            {/*            </div>*/}
            {/*        </div>)*/}
            {/*    }*/}

            {/*}*/}
            {/*)}*/}

        </Upload>
        {/*{*/}
        {/*    fileViewerVisible && <FileViewer*/}
        {/*        isVisible={!loadingFile && fileViewerVisible}*/}
        {/*        close={closeFileViewer}*/}
        {/*        file={file!}*/}
        {/*    />*/}
        {/*}*/}



    </Fragment>

}


export default observer(FileUploader);