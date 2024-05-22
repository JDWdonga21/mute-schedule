import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Box, Button, Modal, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { addMonths, subMonths, format } from 'date-fns';

interface DateCalendarReferenceDateState {
  referenceDate: Dayjs;
  displayedMonth: Dayjs;
}

class DateCalendarReferenceDate extends React.Component<{}, DateCalendarReferenceDateState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      referenceDate: dayjs(),
      displayedMonth: dayjs(),
    };
  }

  handlePrevMonth = () => {
    this.setState((prevState) => ({
      displayedMonth: dayjs(subMonths(prevState.displayedMonth.toDate(), 1)),
    }));
  };

  handleNextMonth = () => {
    this.setState((prevState) => ({
      displayedMonth: dayjs(addMonths(prevState.displayedMonth.toDate(), 1)),
    }));
  };

  handleToday = () => {
    const today = dayjs();
    this.setState({ displayedMonth: today, referenceDate: today });
  };

  render() {
    const { referenceDate, displayedMonth } = this.state;

    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '25%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          관제 예외일정
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
          <Button variant="contained" onClick={this.handlePrevMonth}>
            이전
          </Button>
          <Typography variant="h6" component="div">
            {format(displayedMonth.toDate(), 'yyyy.MM')}
          </Typography>
          <Button variant="contained" onClick={this.handleNextMonth}>
            다음
          </Button>
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={referenceDate}
            onChange={(date) => this.setState({ referenceDate: date || dayjs() })}
            views={['year', 'month', 'day']}
          />
        </LocalizationProvider>
        <Button variant="contained" color="primary" onClick={this.handleToday} sx={{ mt: 2 }}>
          오늘
        </Button>
      </Box>
    );
  }
}

export default DateCalendarReferenceDate;