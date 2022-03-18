using BS.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Infrastructure.Shared.Persian
{
    public class AdjustChar : IAdjustChar
    {
        public string ChangeToArabicChar(string input)
        {
            if (input == null)
                return "";
            return input.Replace("ی", "ي").Replace("ک", "ك");
        }

        public string PersianNumbersToEnglish(string persianStr)
        {
            Dictionary<char, char> LettersDictionary = new Dictionary<char, char>
            {
                ['۰'] = '0',
                ['۱'] = '1',
                ['۲'] = '2',
                ['۳'] = '3',
                ['۴'] = '4',
                ['۵'] = '5',
                ['۶'] = '6',
                ['۷'] = '7',
                ['۸'] = '8',
                ['۹'] = '9'
            };
            foreach (var item in persianStr)
            {
                try
                {
                    persianStr = persianStr.Replace(item, LettersDictionary[item]);
                }
                catch (Exception)
                {
                }

            }
            return persianStr;
        }

        public string AdjustCharForDb(string input)
        {
            var result = ChangeToArabicChar(input);
            return PersianNumbersToEnglish(result);
        }
    }
}
