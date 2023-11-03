import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DateInput from '../../components/FormFields/DateInput';
import { Button } from '../../components/styled/Button';
import settings from '../../core/settings/settings';
export default function Sandbox() {
  const [dates, setDates] = useState(null);
  const [tempDate, setTempDate] = useState(null);

  useEffect(() => {
    setDates([moment('2019-01-01'), moment(new Date(2019, 0, 2)), moment('20190103')]);
  }, []);

  const handleDateChange = date => {
    if (date) {
      setTempDate(date);
    }
  };

  return (
    <div>
      {dates &&
        dates.map((d, i) => {
          return (
            <div key={i}>
              {moment(d)
                .locale(settings.LOCALE)
                .format('L')}
            </div>
          );
        })}

      <div>
        <DateInput selected={moment(tempDate).isValid() ? moment(tempDate) : null} onChange={handleDateChange} />
      </div>
      <Button onClick={() => setDates([...dates, tempDate])}>Add</Button>
    </div>
  );
}
