import { CloseCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import DatePicker, { Day, DayRange } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { addYears, addDays, combineDateParts, convertToDatePickerValue, addMonths } from "../../../app/common/util/util";



interface IProps {
    fromDateProperty : string;
    toDateProperty : string;
    relatedObject : object;
    relatedFunction : ( input : object, immediateLoad : boolean ) => void;
    durationValue ?: number;
    durationType ?: string; //day  year  month
    clearable ?: boolean;
    defaultToDate ?: string;
    defaultFromDate ?: string;
    isImmediateLoad ?: boolean;
    isSelected : boolean;
    validateField ?: () => void;
}
const defaultProps : any = {
    durationValue: 0,
    durationType: "notDefined",
    clearable: true,
    isImmediateLoad: false,
};
const RangeCustomDatePicker : React.FC<IProps> = ( {
    fromDateProperty,
    toDateProperty,
    relatedObject,
    relatedFunction,
    durationValue,
    durationType,
    clearable,
    defaultToDate,
    isImmediateLoad,
    defaultFromDate,
    isSelected,
    validateField

} ) => {

    const map = new Map( Object.entries( relatedObject ) );


    // کنترل انتخاب بازه تاریخ
    const [ minDate, setMinDate ] = useState<Day | undefined>( undefined );
    const [ maxDate, setMaxDate ] = useState<Day | undefined>( undefined );
    const setMinAndMax = ( input : Day | undefined ) => {
        if ( input !== undefined ) {
            if ( durationValue! > 0 ) {
                setMinDate( input );
                switch ( durationType ) {
                    case "day":
                        setMaxDate( addDays( { ...input }, durationValue! ) );
                        break;
                    case "month":
                        setMaxDate( addMonths( { ...input }, durationValue! ) );
                        break;
                    case "year":
                        setMaxDate( addYears( { ...input }, durationValue! ) );
                        break;
                    default:
                        break;
                }
            }
        }
        else {
            setMaxDate( undefined );
            setMinDate( undefined );
        }
    }

    const [ frmDate, setFrmDate ] = useState<string | null>( null );
    const [ tDate, settDate ] = useState<string | null>( null );

    const cancelOnClick = ( e : any ) : void => {
        setMinAndMax( undefined );
        if ( clearable ) {
            map.set( fromDateProperty, null )
            setFrmDate( null )
            map.set( toDateProperty, null )
            settDate( null )
            const updatedObjesct = Object.fromEntries( map )
            relatedFunction( { ...updatedObjesct }, isImmediateLoad as boolean );
        } else {
            if ( !!defaultFromDate ) {
                map.set( fromDateProperty, defaultFromDate )
                setFrmDate( defaultFromDate )
            }
            if ( !!defaultToDate ) {
                map.set( toDateProperty, defaultToDate )
                settDate( defaultToDate )
            }
            const updatedObjesct = Object.fromEntries( map )
            relatedFunction( { ...updatedObjesct }, isImmediateLoad as boolean );
        }
        e.preventDefault();
        e.stopPropagation();
    }

    const setDateOnChange = ( dateRange : DayRange ) : void => {
        if ( dateRange.from !== undefined ) {
            map.set( fromDateProperty, combineDateParts( dateRange.from! ) == "" ? null : combineDateParts( dateRange.from! ) )
            setFrmDate( combineDateParts( dateRange.from! ) == "" ? null : combineDateParts( dateRange.from! ) )
        }
        if ( dateRange.to !== undefined ) {
            map.set( toDateProperty, combineDateParts( dateRange.to! ) == "" ? null : combineDateParts( dateRange.to! ) )
            settDate( combineDateParts( dateRange.to! ) == "" ? null : combineDateParts( dateRange.to! ) )
        }
        const updatedObjesct = Object.fromEntries( map )
        relatedFunction( { ...updatedObjesct }, isImmediateLoad as boolean );

        if ( validateField != undefined ) {
            validateField();
        }
      
    }

    const setInitialDate = () => {
        const fromDate = map.get( fromDateProperty );
        setFrmDate( fromDate );
        const toDate = map.get( toDateProperty );
        settDate( toDate );
    }

    useEffect( () => {
        setInitialDate();
    }, [ map.get( fromDateProperty ), map.get( toDateProperty ) ] );

    //useEffect(() => {
    //    set();
    //}, [relatedObject])

    return (
        <DatePicker
            locale="fa"
            value={ convertToDatePickerValue(
                frmDate,
                tDate
            ) }
            onChange={ ( dateRange : DayRange ) => {
                setMinAndMax( dateRange.from! );
                setDateOnChange( dateRange )
            } }
            maximumDate={ maxDate }
            minimumDate={ minDate }
            shouldHighlightWeekends
            calendarPopperPosition="bottom"
            wrapperClassName={
                isSelected ? "calendarWrapper" : ""
            }
            calendarClassName="responsive-calenda"
            renderFooter={ () => (
                <div
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
            ) }
        />
    )
};
RangeCustomDatePicker.defaultProps = defaultProps;
export default RangeCustomDatePicker;
