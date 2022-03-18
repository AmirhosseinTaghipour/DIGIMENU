import React, { Suspense } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";

//const AdaptionReports = React.lazy( () => import( './TabPages/AdaptionReports/AdaptionReports' ) )
//const FinancialReport = React.lazy( () => import('./TabPages/FinancialReport/FinancialReport'))
//const OperationalReport = React.lazy( () => import( './TabPages/OperationalReport/OperationalReport' ) )
//const Kartable = React.lazy( () => import( './TabPages/Kartable/Kartable' ) )
//const CloseKartable = React.lazy( () => import( './TabPages/Kartable/CloseKartable' ) )
//const SamplingProgramsList = React.lazy( () => import( './TabPages/NTPrograms/SamplingProgramsList' ) )
//const OnGoingSamplingProgramsList = React.lazy( () => import( './TabPages/NTPrograms/OnGoingSamplingProgramsList' ) )
//const TerminatedSamplingProgramsList = React.lazy( () => import( './TabPages/NTPrograms/TerminatedSamplingProgramsList' ) )
//const ReceiptSampleList = React.lazy( () => import( './TabPages/ReceiptSample/ReceiptSampleList' ) )


interface IProps {
    resourceId : string;
}

const CallControl : React.FC<IProps> = ( { resourceId } ) => {

    if ( resourceId ) {
       /* switch ( resourceId ) {*/
            //// گزارش مالی
            //case "fcda2a34-2937-4970-9a80-c460a7422e75":
            //    return <Suspense fallback={ <LoadingComponent /> }> <FinancialReport /></Suspense>;

            //// کارتابل
            //case "a5d8ba71-16bc-44cd-b806-1ff56e611309":
            //    return <Suspense fallback={ <LoadingComponent /> }><Kartable /></Suspense>;

            //// کارتابل ارجاعی
            //case "d3a58cca-79c0-4e2e-9044-6d6456809739":
            //    return <Suspense fallback={ <LoadingComponent /> }><CloseKartable /></Suspense>;

            //// جستجوی پذیرش
            //case "b32a1556-d183-409e-9cdb-3f4daa162f96":
            //    return <Suspense fallback={ <LoadingComponent /> }><AdaptionReports /></Suspense>;

            //// گزارش عملکرد
            //case "a6c0e430-6f11-4dda-a58c-ec3d9245416c":
            //    return <Suspense fallback={ <LoadingComponent /> }><OperationalReport /></Suspense>;

            //// لیست برنامه های نمونه برداری
            //case "399ebfad-a798-4028-a0b2-644a8c6ac150":
            //    return <Suspense fallback={ <LoadingComponent /> }><SamplingProgramsList /></Suspense>;

            //// لیست برنامه های نمونه برداری در حال انجام
            //case "f03f0a3c-b7d2-4d9f-a3f2-827941914bcb":
            //    return <Suspense fallback={ <LoadingComponent /> }><OnGoingSamplingProgramsList /></Suspense>;

            //// لیست برنامه های نمونه های خاتمه یافته
            //case "39dc0a44-a40d-4674-b4aa-90830bb45c07":
            //    return <Suspense fallback={ <LoadingComponent /> }><TerminatedSamplingProgramsList /></Suspense>;

            //// درخواست پذيرش نمونه
            //case "82bfa66a-3f63-4bc0-ba65-e3ae24b51a00":
            //    return <Suspense fallback={ <LoadingComponent /> }><ReceiptSampleList step="NotStartProgress" /></Suspense>;
            //default:
                return null; 
     /*   }*/
    } else {
        return null;
    }
};

export default CallControl;
