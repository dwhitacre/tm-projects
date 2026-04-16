namespace Domain {
    namespace Month {
        const string January = "January";
        const string February = "February";
        const string March = "March";
        const string April = "April";
        const string May = "May";
        const string June = "June";
        const string July = "July";
        const string August = "August";
        const string September = "September";
        const string October = "October";
        const string November = "November";
        const string December = "December";
    }

    string MonthFromInt(uint num) {
        switch (num) {
            case 1:  return Month::January;
            case 2:  return Month::February;
            case 3:  return Month::March;
            case 4:  return Month::April;
            case 5:  return Month::May;
            case 6:  return Month::June;
            case 7:  return Month::July;
            case 8:  return Month::August;
            case 9:  return Month::September;
            case 10: return Month::October;
            case 11: return Month::November;
            default: return Month::December;
        }
    }
}
