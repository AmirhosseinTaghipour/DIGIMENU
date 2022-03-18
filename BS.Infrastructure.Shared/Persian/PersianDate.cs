using BS.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Infrastructure.Shared.Persian
{
    public class PersianDate : IPersianDate
    {
        public int PersianDateDifference(string fromDate, string toDate)
        {
            if (string.IsNullOrEmpty(fromDate) || string.IsNullOrEmpty(toDate))
            {
                return 0;
            }
            DateTime fromEnDateTime = ToMiladi(fromDate);
            DateTime toEnDateTime = ToMiladi(toDate);

            string result = (toEnDateTime - fromEnDateTime).ToString().Replace(".00:00:00", "");


            return Convert.ToInt32(result == "00:00:00" ? "0" : result);
        }

        public int PersianDateDifference(string date)
        {
            if (string.IsNullOrEmpty(date))
            {
                return 0;
            }

            DateTime EnDateTime = ToMiladi(date);

            string result = (DateTime.Now.Date - EnDateTime).ToString().Replace(".00:00:00", "");

            return Convert.ToInt32(result == "00:00:00" ? "0" : result);
        }

        public DateTime ToMiladi(string shamsiDate, string time = null)
        {
            if (string.IsNullOrEmpty(shamsiDate))
            {
                return new DateTime();
            }

            PersianCalendar pc = new PersianCalendar();
            string[] DateParts = shamsiDate.Split('/', '-');


            if (string.IsNullOrEmpty(time))
            {
                DateTime DateTime = pc.ToDateTime(Convert.ToInt32(DateParts[0]), Convert.ToInt32(DateParts[1]), Convert.ToInt32(DateParts[2]), 0, 0, 0, 0);
                return DateTime;
            }
            else
            {
                string[] TimeParts = time.Split(':');
                DateTime DateTime = pc.ToDateTime(Convert.ToInt32(DateParts[0]), Convert.ToInt32(DateParts[1]), Convert.ToInt32(DateParts[2]), Convert.ToInt32(TimeParts[0]), Convert.ToInt32(TimeParts[1]), 0, 0);
                return DateTime;
            }
        }

        public string toShamsi(DateTime? input)
        {
            if (input == null)
                return "";

            DateTime date = input.Value;

            PersianCalendar pc = new PersianCalendar();
            return $"{pc.GetYear(date)}/{getTwoDigitNumber(pc.GetMonth(date).ToString())}/{getTwoDigitNumber(pc.GetDayOfMonth(date).ToString())}";
        }

        public string getTwoDigitNumber(string number)
        {
            if (Convert.ToInt32(number) < 10)
            {
                return $"0{number.Trim()}";
            }
            return number.ToString().Trim();
        }

        public string getShortTime(DateTime? input)
        {
            if (input == null)
                return "";

            DateTime date = input.Value;

            return $"{getTwoDigitNumber(date.Hour.ToString())}:{getTwoDigitNumber(date.Minute.ToString())}";
        }
    }
}
