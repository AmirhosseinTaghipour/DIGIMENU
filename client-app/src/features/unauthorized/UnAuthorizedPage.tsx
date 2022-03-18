import React, { useContext, useEffect } from "react";
import NotFound from "../../app/layout/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { RootStoreContext } from "../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

interface IProps {
    page : string;
    id : string;
}

const UnAuthorizedPage : React.FC<RouteComponentProps<IProps>> = ( { match } ) => {

    const rootStore = useContext( RootStoreContext );
    //const {
    //    loadAnalayzeSheet,
    //    AnalayzeSheetData,
    //    AnalayzeSheetLetterData,
    //    loadingAnalayzeSheet,
    //    loadAnalayzeSheetLetter,
    //    loadingAnalayzeSheetLetter,
    //    calculatingAnalizeSheet,
    //    analyzeSheetSizes,
    //    loadAnalayzeSheetInvoice,
    //    AnalayzeSheetInvoiceData,
    //    loadingAnalayzeSheetInvoice,
    //    analyzeSheetInvoiceSizes,
    //    calculatingAnalizeSheetInvoice,
    //} = rootStore.analyzeSheetStore;
    const { id, page } = match.params;
    //useEffect( () => {
    //    switch ( page ) {
    //        case "AnalayzeSheet":
    //            loadAnalayzeSheet( id, "UnAuthorized" );
    //            break;
    //        case "AnalayzeSheetInvoice":
    //              loadAnalayzeSheetInvoice( id, 2, "", "UnAuthorized" );
    //            break;
    //        case "AnalayzeSheetLetter":
    //            loadAnalayzeSheetLetter( id, "UnAuthorized" );
    //            break;
    //    }
    //}, [ page, id ] );


    //switch ( page ) {
    //    case "AnalayzeSheet":
    //        if ( loadingAnalayzeSheet || calculatingAnalizeSheet )
    //            return <LoadingComponent />;
    //        else {
    //            if ( AnalayzeSheetData ) {
    //                return (
    //                    null
    //                //    <AnalyzeSheet data={ AnalayzeSheetData! } sizes={ analyzeSheetSizes } />
    //                );
    //            }
    //        }

    //        break;
    //    case "AnalayzeSheetInvoice":
    //        if ( loadingAnalayzeSheetInvoice || calculatingAnalizeSheetInvoice )
    //            return <LoadingComponent />;
    //        else {
    //            if ( AnalayzeSheetInvoiceData ) {
    //                return (
    //                    null
    //                    //<AnalyzeSheetInvoice
    //                    //    data={ AnalayzeSheetInvoiceData! }
    //                    //    sizes={ analyzeSheetInvoiceSizes }
    //                    ///>
    //                );
    //            }
    //        }
    //        break;
    //    case "AnalayzeSheetLetter":
    //        if ( loadingAnalayzeSheetLetter ) return <LoadingComponent />;
    //        else {
    //            if ( AnalayzeSheetLetterData ) {
    //                return null /*<AnalyzeSheetLetter data={ AnalayzeSheetLetterData! } />*/;
    //            }
    //        }
    //        break;
    //    default:
    //        return <NotFound />;
    //}

    return <LoadingComponent />;
};

export default observer( UnAuthorizedPage );
