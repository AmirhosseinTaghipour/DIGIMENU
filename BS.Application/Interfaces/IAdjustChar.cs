using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Interfaces
{
    public interface IAdjustChar
    {
        string ChangeToArabicChar(string input);
        string PersianNumbersToEnglish(string input);
        string AdjustCharForDb(string input);
    }
}
