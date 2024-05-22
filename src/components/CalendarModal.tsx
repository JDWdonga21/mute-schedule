import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Box, Button, Modal, AppBar, Toolbar, Typography, createTheme, ThemeProvider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { addMonths, subMonths, format } from 'date-fns';

interface DateCalendarReferenceDateState {
  referenceDate: Dayjs;
  displayedMonth: Dayjs;
  selectedDate: Dayjs | null;
}

interface DateCalendarProps {
  open: boolean;
  onClose: () => void;
}

// Augment the palette to include a salmon color
declare module '@mui/material/styles' {
  interface Palette {
    salmon: Palette['primary'];
  }

  interface PaletteOptions {
    salmon?: PaletteOptions['primary'];
  }
}

// Update the Button's color options to include a salmon option
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    salmon: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    salmon: {
      main: '#FF5733',
    },
  },
});

class DateCalendarReferenceDate extends React.Component<DateCalendarProps, DateCalendarReferenceDateState> {
  calendarRef = React.createRef<FullCalendar>();

  constructor(props: DateCalendarProps) {
    super(props);
    this.state = {
      referenceDate: dayjs(),
      displayedMonth: dayjs(),
      selectedDate: null,
    };
  }

  handlePrevMonth = () => {
    this.setState((prevState) => ({
      displayedMonth: dayjs(subMonths(prevState.displayedMonth.toDate(), 1)),
      referenceDate: dayjs(subMonths(prevState.referenceDate.toDate(), 1)),
    }));
    const calendarApi = this.calendarRef.current?.getApi();
    calendarApi?.prev();
  };

  handleNextMonth = () => {
    this.setState((prevState) => ({
      displayedMonth: dayjs(addMonths(prevState.displayedMonth.toDate(), 1)),
      referenceDate: dayjs(addMonths(prevState.referenceDate.toDate(), 1)),
    }));
    const calendarApi = this.calendarRef.current?.getApi();
    calendarApi?.next();
  };

  handleToday = () => {
    const today = dayjs();
    this.setState({ displayedMonth: today, referenceDate: today });
    const calendarApi = this.calendarRef.current?.getApi();
    calendarApi?.today();
  };

  handleDateSelect = (selectInfo: any) => {
    this.setState({ selectedDate: dayjs(selectInfo.start) });
    alert(`Selected date: ${selectInfo.startStr}`);
  };

  render() {
    const { referenceDate, displayedMonth } = this.state;
    const { open, onClose } = this.props;

    return (
        <Modal
            open={open}
            onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
                onClose();
            }
            }}
        >
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '35%',
              transform: 'translate(-50%, -50%)',
              width: '60vw',
              height: '60vh',
              bgcolor: 'background.paper',
              boxShadow: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <AppBar
              position="static"
              color="default"
              elevation={0}
              sx={{
                width: '100%',
                height: '7vh',
                bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
                borderBottom: '3px solid',
                justifyContent: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                display: 'flex',
              }}
            >
              <Toolbar>
                <Typography fontWeight={900} variant="h6" component="h2" gutterBottom sx={{ flexGrow: 1, marginLeft: 3, marginTop: 1, marginBottom: 1 }}>
                  관제 예외일정
                </Typography>
                <div onClick={onClose} style={{ cursor: 'pointer' }}>
                  <CloseIcon />
                </div>
              </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '7vh', width: '100%', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
                <Button variant="contained" onClick={this.handlePrevMonth}>
                  이전
                </Button>

                <Typography variant="h6" component="div" sx={{ marginRight: 4, marginLeft: 4 }}>
                  {format(displayedMonth.toDate(), 'yyyy.MM')}
                </Typography>

                <Button variant="contained" onClick={this.handleNextMonth}>
                  다음
                </Button>
              </Box>
              <Box sx={{ marginLeft: '-10%', alignItems: 'center', justifyContent: 'end' }}>
                <Button variant="contained" color="salmon" onClick={this.handleToday}>
                  오늘
                </Button>
              </Box>
            </Box>

            <Box sx={{ width: '100%', height: '75vh' }}>
              <FullCalendar
                ref={this.calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={false}
                selectable={true}
                select={this.handleDateSelect}
                height="100%"
                events={[
                  { title: 'Long Event', start: '2024-05-07', end: '2024-05-10' },
                  { title: 'Some Event', start: '2024-05-09' },
                  // Add more events here
                ]}
              />
            </Box>
          </Box>
        </ThemeProvider>
      </Modal>
    );
  }
}

export default DateCalendarReferenceDate;