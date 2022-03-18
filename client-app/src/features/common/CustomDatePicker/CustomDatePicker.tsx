import { CloseCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import DatePicker, { DayValue } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { combineDateParts, convertToDatePickerType } from "../../../app/common/util/util";

interface IProps {
    dateProperty : string;
    isSelected : boolean;
    relatedObject : object;
    relatedFunction : ( input : object, immediateLoad : boolean ) => void;
    defaultDate ?: string;
    isImmediateLoad ?: boolean;
    clearable ?: boolean;
    maxDate ?: string;
    minDate ?: string;
    lang ?: string;
    validateField ?: () => void;


}
const defaultProps : any = {
    clearable: true,
    isImmediateLoad: false,
    lang: "fa"
};
const CustomDatePicker : React.FC<IProps> = ( {
    dateProperty,
    isSelected,
    relatedObject,
    relatedFunction,
    defaultDate,
    isImmediateLoad,
    clearable,
    maxDate,
    minDate,
    lang,
    validateField


} ) => {
    const map = new Map( Object.entries( relatedObject! ) );

    const [ currentDate, setCurrentDate ] = useState<string | null>( null );

    const setDateOnChange = ( date : DayValue ) : void => {
        if ( date !== undefined ) {
            map.set( dateProperty, combineDateParts( date ) == "" ? null : combineDateParts( date ) )
            setCurrentDate( combineDateParts( date ) == "" ? null : combineDateParts( date ) )
        }

        const updatedObjesct = Object.fromEntries( map )
        relatedFunction( { ...updatedObjesct }, isImmediateLoad as boolean );

        if ( validateField != undefined ) {
            validateField();
        }

    }

    const setInitialDate = () => {
        const date = map.get( dateProperty );
        setCurrentDate( date );
    }
    const cancelOnClick = ( e : any ) : void => {
        if ( clearable ) {
            map.set( dateProperty, null )
            setCurrentDate( null )
            const updatedObjesct = Object.fromEntries( map )
            relatedFunction( { ...updatedObjesct }, isImmediateLoad as boolean );
        } else {
            if ( !!defaultDate ) {
                map.set( dateProperty, defaultDate )
                setCurrentDate( defaultDate )
            }
            const updatedObjesct = Object.fromEntries( map )
            relatedFunction( { ...updatedObjesct }, isImmediateLoad as boolean );
        }
        e.preventDefault();
        e.stopPropagation();
    };


    useEffect( () => {
        setInitialDate();
    }, [ map.get( dateProperty ) ] );



    return (

        <DatePicker
            locale={ lang }
            value={ currentDate ? convertToDatePickerType( currentDate ) : null }
            onChange={ ( date : DayValue ) => {
                setDateOnChange( date );
            } }

            shouldHighlightWeekends
            calendarPopperPosition="bottom"

            wrapperClassName={
                isSelected ? "calendarWrapper" : ""
            }
            calendarClassName="responsive-calenda"
            renderFooter={ () => {
                if ( clearable && !!defaultDate ) {
                    return <div
                        style={ {
                            display: "flex",
                            justifyContent: "center",
                            paddingBottom: "1rem",
                        } }
                    >
                        <CloseCircleOutlined
                            onClick={ ( e ) => cancelOnClick( e ) }
                            style={ { color: "#fab1a0", fontSize: "2rem" } }
                        />
                    </div>
                }
                else {
                    return null;
                }
            } }
            minimumDate={ minDate ? convertToDatePickerType( minDate ) : undefined }
            maximumDate={ maxDate ? convertToDatePickerType( maxDate ) : undefined }
        />
    )
};
CustomDatePicker.defaultProps = defaultProps;
export default CustomDatePicker;
