import { utils, DayRange, Day } from "react-modern-calendar-datepicker";
import Cookies from "universal-cookie";
import { notification } from "antd";
import { IconType, NotificationPlacement } from "antd/lib/notification";
import moment, { duration } from 'jalali-moment'

const cookies = new Cookies();



const toEnglishNumber = (s: string) => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
const toPersianNumber = (s: string) => s.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]).replace(/[٠-٩]/g, d => '۰۱۲۳۴۵۶۷۸۹'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);

export const isNumeric = (input: string | number | undefined | null) => {
    if (input == null || input == undefined) {
        return false;
    } else if (typeof (input) == "number") {
        return true;
    } else if (typeof (input) == "string") {
        return /^-?\d+$/.test(input);
    } else {
        return false;
    }
}


export const getPersianNum = (input: string) => {
    return toPersianNumber(input);
};

export const getPersianChar = (input: string | null) => {
    if (input == null) {
        return "";
    } else {
        return input.replace(/ي/g, "ی").replace(/ك/g, "ک");
    }
};

export const getArabicChar = (input: string | null) => {
    if (input == null) {
        return "";
    } else {
        return input.replace(/ی/g, "ي").replace(/ک/g, "ك");
    }


};


export const toPersianChar = (input: string | null | undefined) => {
    let result = "";
    if (typeof input === 'string' && input.length > 0) {
        result = toPersianNumber(input);
        result = getPersianChar(result);
        return result;
    }
    return result;
};


export const trim = (input: string | null | undefined) => {
    if (typeof input === 'string' && input.length > 0) {
        return input.trim();
    } else {
        return input;
    }
}

export const toNumberFormat = (input: string | number | undefined | null) => {
    if (isNumeric(input)) {
        if (typeof (input) == "number") {
            return Intl.NumberFormat().format(input!);
        } else if (typeof (input) == "string") {
            return Intl.NumberFormat().format(Number(input!));
        } else {
            return input
        }
    }
    else {
        return typeof (input) == "string" ? input : input?.toString();
    }

}


export const toDatabaseChar = (input: string | null | undefined) => {
    let result = "";

    if (typeof input === 'string') {
        result = toEnglishNumber(input);
        result = getArabicChar(result);
        return result.trim();


    } else {
        return null;
    }

};


export const forceTwoDigit = (input: number) => {
    if (input < 10) {
        return `0${input}`;
    } else {
        return `${input}`;
    }
};

export const combineDateParts = (input: Day | null) => {
    if (!(input && input.year && input.month && input.day)) return "";
    return `${input.year}/${forceTwoDigit(input.month)}/${forceTwoDigit(
        input.day
    )}`;
};

export const convertToDatePickerType = (input: string | null) => {
    if (!IsNullOrEmpty(input)) {
        const value = input?.split("/");
        let result: Day = {
            day: parseInt(value![2]),
            month: parseInt(value![1]),
            year: parseInt(value![0]),
        };

        return result;
    } else {
        return getCurrentPersianDate();
    }
};

export const convertToDatePickerValue = (
    from: string | null,
    to: string | null
) => {
    let result: DayRange = {
        from: null,
        to: null,
    };
    if (from && from !== "") {
        const fromValue = from.split("/");
        result.from = {
            day: parseInt(fromValue[2]),
            month: parseInt(fromValue[1]),
            year: parseInt(fromValue[0]),
        };
    }

    if (to && to !== "") {
        const toValue = to.split("/");
        result.to = {
            day: parseInt(toValue[2]),
            month: parseInt(toValue[1]),
            year: parseInt(toValue[0]),
        };
    }

    return result;
};

export const getCurrentPersianDate = () => {
    return utils("fa").getToday();
};

export const addDays = (date: Day, input: number, lang?: string) => {

    const m = moment.from(`${date.year}/${forceTwoDigit(date.month)}/${forceTwoDigit(date.day)}`, !lang ? 'fa' : lang.toLowerCase(), "YYYY/MM/DD");
    const result = m.add(input, 'days').locale(!lang ? 'fa' : lang.toLowerCase()).format('YYYY/MM/DD'); // 1367/11/05

    //if ( input < 32 ) {
    //    if ( input > 0 ) {
    //        if ( date.month < 7 ) {
    //            date.day += input;
    //            if ( date.day > 31 ) {
    //                date.day -= 31;
    //                date.month += 1;
    //                if ( date.month > 12 ) {
    //                    date.year += 1;
    //                }
    //            }
    //        } else {
    //            date.day += input;
    //            if ( date.day > 30 ) {
    //                date.day -= 30;
    //                date.month += 1;
    //                if ( date.month > 12 ) {
    //                    date.year += 1;
    //                }
    //            }
    //        }
    //    } else {
    //        if ( date.month < 7 ) {
    //            if ( date.day > Math.abs( input ) ) {
    //                date.day -= Math.abs( input );
    //            } else {
    //                date.day =
    //                    date.month === 1
    //                        ? 30 - ( Math.abs( input ) - date.day )
    //                        : 31 - ( Math.abs( input ) - date.day );
    //                date.month -= 1;
    //                if ( date.month === 0 ) {
    //                    date.month = 12;
    //                    date.year -= 1;
    //                }
    //            }
    //        } else {
    //            if ( date.day > Math.abs( input ) ) {
    //                date.day -= Math.abs( input );
    //            } else {
    //                date.day =
    //                    date.month === 7
    //                        ? 31 - ( Math.abs( input ) - date.day )
    //                        : 30 - ( Math.abs( input ) - date.day );
    //                date.month -= 1;
    //                if ( date.month === 0 ) {
    //                    date.year -= 1;
    //                }
    //            }
    //        }
    //    }
    //}
    //return date;

    return convertToDatePickerType(result);
};

export const addYears = (date: Day, input: number, lang?: string) => {

    //date.year += input;
    //return date;

    const m = moment.from(`${date.year}/${forceTwoDigit(date.month)}/${forceTwoDigit(date.day)}`, !lang ? 'fa' : lang.toLowerCase(), "YYYY/MM/DD");
    const result = m.add(input, 'years').locale(!lang ? 'fa' : lang.toLowerCase()).format('YYYY/MM/DD'); // 1367/11/05
    return convertToDatePickerType(result);

};

export const addMonths = (date: Day, input: number, lang?: string) => {
    //const sumMonth = date.month + input;
    //date.year = date.year + Math.trunc( sumMonth / 12 );
    //date.month = sumMonth % 12;
    //return date;

    const m = moment.from(`${date.year}/${forceTwoDigit(date.month)}/${forceTwoDigit(date.day)}`, !lang ? 'fa' : lang.toLowerCase(), "YYYY/MM/DD");
    const result = m.add(input, 'months').locale(!lang ? 'fa' : lang.toLowerCase()).format('YYYY/MM/DD'); // 1367/11/05
    return convertToDatePickerType(result);

};

export const addToDate = (date: string | null, addType: number | null, value: number | null, lang?: string) => {
    if (!date || !addType || !value) {
        return "";
    } else {

        const m = moment.from(date!, !lang ? 'fa' : lang.toLowerCase(), "YYYY/MM/DD");

        switch (addType) {
            case 1:
                return m.add(value, 'days').locale(!lang ? 'fa' : lang.toLowerCase()).format('YYYY/MM/DD'); // 1367/11/05
            case 2:
                return m.add(value, 'weeks').locale(!lang ? 'fa' : lang.toLowerCase()).format('YYYY/MM/DD'); // 1367/11/05
            case 3:
                return m.add(value, 'month').locale(!lang ? 'fa' : lang.toLowerCase()).format('YYYY/MM/DD'); // 1367/11/05
            case 4:
                return m.add(value, 'years').locale(!lang ? 'fa' : lang.toLowerCase()).format('YYYY/MM/DD'); // 1367/11/05
            default:
                return ""
        }

    }
};

export const compareDates = (date1: string, date2: string) => {
    const date1Parts = date1.split("/");
    const date2Parts = date2.split("/");

    // let result: number = 0;

    const day1: Day = {
        year: Number.parseInt(date1Parts[0]),
        month: Number.parseInt(date1Parts[1]),
        day: Number.parseInt(date1Parts[2]),
    };
    const day2: Day = {
        year: Number.parseInt(date2Parts[0]),
        month: Number.parseInt(date2Parts[1]),
        day: Number.parseInt(date2Parts[2]),
    };
    if (
        day1.day === day2.day &&
        day1.month === day2.month &&
        day1.year === day2.year
    ) {
        // result = 0;
    } else {
        const day1DaysOfYear =
            day1.year * 365 + day1.month > 6
                ? day1.month * 30 + 6
                : day1.month * 30 - 1 + day1.day;
        const day2DaysOfYear =
            day2.year * 365 + day2.month > 6
                ? 6 * 31 + (day2.month - 6) * 30
                : day2.month * 30 + day2.day;
        return day1DaysOfYear - day2DaysOfYear;
    }
};

export const getNumTwoChar = (input: string) => {
    let num: number = Number(input.trim());
    if (num < 10) {
        return `0${num.toString()}`;
    } else {
        return input.trim();
    }
};

export const getImageThumbnail = (input: string) => {
    return input.replace("/image/upload/", "/image/upload/c_thumb,w_200,g_face/");
};

export const getDateTimeIndex = (date: string, time: string) => {
    const datePart: string[] = date.split("/");
    const timePart: string[] = time.split(":");

    return Number(
        `${datePart[0].trim()}${getNumTwoChar(datePart[1])}${getNumTwoChar(
            datePart[2]
        )}${getNumTwoChar(timePart[0])}${getNumTwoChar(timePart[1])}`
    );
};

export const getGlobalDate = (separator: string = "-") => {
    let newDate = new Date();
    let date = forceTwoDigit(newDate.getDate());
    let month = forceTwoDigit(newDate.getMonth() + 1);
    let year = newDate.getFullYear();

    return `${year}${separator}${month}${separator}${date}`;
};

export const getGlobalTime = () => {
    let newDate = new Date();
    let hours = forceTwoDigit(newDate.getHours());
    let minutes = forceTwoDigit(newDate.getMinutes());
    let seconds = forceTwoDigit(newDate.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
};

export const IsNullOrEmpty = (value: string | null | undefined) => {
    return !(value != undefined && value != null && value.length > 0);
};

export const ListIsNullOrEmpty = (values: any[] | null | undefined) => {
    return !(values != undefined && values != null && values.length > 0);
};

export const AddCookie = (name: string, value: string) => {
    cookies.set(name, value, {
        path: "/",
        sameSite: "strict",
    });
};

export const RemoveCookie = (name: string) => {
    cookies.remove(name);
};

export const GetCookie = (name: string) => {
    const cookie = cookies.get(name);
    if (cookie) {
        return `${cookie}`;
    } else {
        return null;
    }
};



export const openNotification = (type: IconType, title: string, content: string, placement: NotificationPlacement,) => {

    notification.open({
        message: title,
        description: content,
        type: type,
        placement: placement,
    });
};


export const selectTableRows = (event: any, key: string, list: string[]) => {
    let result: string[] = [];
    if (event.ctrlKey) {
        if (list.indexOf(key) > -1) {
            result = list.filter(function (value) { return value != key })

        } else {
            result = [...list, key];
        }
    }
    else {
        if (list.indexOf(key) > -1) {
            result = []
        } else {
            result = [key];
        }
    }

    return result;
}


export const isShamsiDate = (date: string | null | undefined) => {
    if (date == null || date == undefined || date?.length < 10) {
        return -1;
    } else {
        return date.substring(0, 4) < "1800" ? 1 : 0;
    }
}


export const convertToDictionary = (obj: any) => {
    let formData = new FormData();
    const map = new Map(Object.entries(obj));
    map.forEach((value, key) => {
        if (typeof (value) != "undefined") {
            if (typeof (value) == "string" || value instanceof Blob) {
                formData.append(key, value);
            } else {
                formData.append(key, `${value}`);
            }
        }
    });

    return formData
}


export const buildFormData = (formData: FormData, data: any, parentKey: any) => {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
        Object.keys(data).forEach(key => {
            buildFormData(formData, data[key], parentKey ? `${parentKey}.${key}` : key);
        });
    } else {
        const value = data == null ? '' : data;

        formData.append(parentKey, value);
    }
}


export const jsonToFormData = (data: any) => {
    const formData = new FormData();

    buildFormData(formData, data, null);

    return formData;
}


export const validateNationalCode = (input: string): boolean => {
    if (!/^\d{10}$/.test(input)) return false;

    //Check if all the numbers are same
    let allNumbersSame = true;
    for (let i = 1; i < 10; i++) {
        allNumbersSame = (input[0] == input[i]);
        if (!allNumbersSame) break;
    }
    if (allNumbersSame) return false;

    const check = +input[9];
    const sum = input.split('').slice(0, 9).reduce((acc, x, i) => acc + +x * (10 - i), 0) % 11;
    return sum < 2 ? check === sum : check + sum === 11;
}

export const validateNationalLegalId = (input: string): boolean => {
    if (!/^\d{11}$/.test(input)) return false;

    let c, d, s;
    c = parseInt(input.substr(10, 1));
    d = parseInt(input.substr(9, 1)) + 2;
    let z = [29, 27, 23, 19, 17];
    s = 0;
    for (let i = 0; i < 10; i++)
        s += (d + parseInt(input.substr(i, 1))) * z[i % 5];
    s = s % 11;
    if (s == 10) s = 0;
    return (c == s);

}

export const checkJustNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/^[0-9]*$/.test(e.key) && ![8, 9, 13, 17, 37, 39, 46, 67, 86, 88].includes(e.keyCode))
        e.preventDefault();
}

export const validateEmail = (input: string): boolean => {
    var res = false
    var regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regExp.test(input.toLowerCase()))
        res = true
    return res;
}; 