using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces
{
    public interface IPersianDate
    {
        int PersianDateDifference(string fromDate, string toDate);
        int PersianDateDifference(string date);
        DateTime ToMiladi(string shamsiDate, string time = null);
        string toShamsi(DateTime? date);
        string getTwoDigitNumber(string number);
        string getShortTime(DateTime? dateTime);

    }
}
