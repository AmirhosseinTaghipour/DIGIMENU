import React, { Suspense } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";

const UnitInformation = React.lazy(() => import('./TabPages/unitInformation/UnitInformation'))
const CategoryItem = React.lazy(() => import('./TabPages/categoryItem/CategoryItem'))
const UnitMenu = React.lazy(() => import('./TabPages/unitMenu/UnitMenu'))
const Payment = React.lazy(() => import('./TabPages/payment/Payment'))
const MenuCategoryList = React.lazy(() => import('./TabPages/menuCategory/MenuCategoryList'))
const CategoryIconList = React.lazy(() => import('./TabPages/categoryIcon/CategoryIconList'))



interface IProps {
    menuCode: string | null;
}

const ContentControl: React.FC<IProps> = ({ menuCode }) => {

    if (!!menuCode) {
        switch (menuCode) {
            case "unit-info":
                return <Suspense fallback={<LoadingComponent content="در حال بارگذاری ..." />}> <UnitInformation /></Suspense>;
            case "create-item":
                return <Suspense fallback={<LoadingComponent content="در حال بارگذاری ..." />}> <CategoryItem /></Suspense>;
            case "create-category":
                return <Suspense fallback={<LoadingComponent content="در حال بارگذاری ..." />}> <MenuCategoryList /></Suspense>;
            case "payment":
                return <Suspense fallback={<LoadingComponent content="در حال بارگذاری ..." />}> <Payment /></Suspense>;
            case "create-menu":
                return <Suspense fallback={<LoadingComponent content="در حال بارگذاری ..." />}> <UnitMenu /></Suspense>;
            case "icon-management":
                return <Suspense fallback={<LoadingComponent content="در حال بارگذاری ..." />}> <CategoryIconList /></Suspense>;
            default:
                return null;
        }

    } else {
        return null;
    }
};
export default ContentControl;


        //// کارتابل
        //case "a5d8ba71-16bc-44cd-b806-1ff56e611309":
        //    return <Suspense fallback={ <LoadingComponent /> }><Kartable /></Suspense>;