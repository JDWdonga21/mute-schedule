import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Box, Button, Modal, AppBar, Toolbar, Typography, createTheme, ThemeProvider, CardContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { addMonths, subMonths, format } from 'date-fns';
import { Event } from './types'; // 이벤트 타입 정의가 포함된 파일
import Card from '@mui/material/Card';

interface CalendarEvents {
    // id: number;
    // created_at: string;
    // updated_at: string;
    // user_uuid: string;
    // type: string;
    // start_date: string;
    // end_date: string | null;
    // reason: string;
    // description: string;
    // status: number;
    // create_user_uuid: string;
    title: string;
    start: string;
    end: string | null;
}

interface DateCalendarReferenceDateState {
  referenceDate: Dayjs;
  displayedMonth: Dayjs;
  selectedDate: Dayjs;
  events: CalendarEvents[];
}

interface DateCalendarProps {
  open: boolean;
  onClose: () => void;
  isModalOpenR: boolean;
  onOpenR: () => void;
  onCloseR: () => void;
  events: Event[];

  
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
      selectedDate: dayjs(),
      events: []
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
    this.setState({ displayedMonth: today, referenceDate: today, selectedDate: today });
    const calendarApi = this.calendarRef.current?.getApi();
    calendarApi?.today();
  };
  //달력 일자 선택 이벤트
  handleDateSelect = (selectInfo: any) => {
    this.setState({ selectedDate: dayjs(selectInfo.start) });
    if(!this.props.isModalOpenR){
      this.props.onOpenR();
    }
    alert(`Selected date: ${selectInfo.startStr}`);
  };

  // 선택된 날짜에 해당하는 이벤트 필터링
  // getFilteredEvents = () => {
  //   const { events } = this.props;
  //   const {selectedDate} = this.state;
  //   if(selectedDate === null){
  //     return []
  //   }
  //   return events.filter(event => {
  //     const startDate = new Date(event.start_date);
  //     const endDate = event.end_date ? new Date(event.end_date) : new Date(event.start_date);
  //     return startDate <= selectedDate && selectedDate <= endDate;
  //   });
  // }
  render() {
    const { referenceDate, displayedMonth, selectedDate } = this.state;
    const { open, onClose, onCloseR } = this.props;
    const filteredEvents = this.props.events;
    return (
        <Modal
            open={open}
            // onClose={(event, reason) => {
            // if (reason !== 'backdropClick') {
            //     onClose();
            // }
            // }}
            hideBackdrop
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
                  { title: 'Long Event', start: '2024-05-07', end: '2024-05-10' },
                  { title: 'Long Event', start: '2024-05-07', end: '2024-05-10' },
                  { title: 'Long Event', start: '2024-05-07', end: '2024-05-10' },
                  { title: 'Long Event', start: '2024-05-07', end: '2024-05-10' },
                  { title: 'Long Event', start: '2024-05-07', end: '2024-05-10' },
                  { title: 'Some Event', start: '2024-05-09' },
                  // Add more events here
                ]}
              />
            </Box>
          </Box>
          {/* 이동한 이벤트 리스트 */}
          {this.props.isModalOpenR && (
            <Box 
            sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '85%', 
                transform: 'translate(-50%, -50%)', 
                width: 400, 
                height: 400, // Set a fixed height for the modal to enable scrolling
                bgcolor: 'background.paper', 
                p: 2, 
                overflow: 'hidden', // Hide overflow on the modal box itself
                display: 'flex',
                flexDirection: 'column'
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
                        {/* {selectedDate.toLocaleDateString()} */}
                        {format(selectedDate.toDate(), 'yyyy.MM.dd')}
                    </Typography>
                    <div onClick={onCloseR} style={{ cursor: 'pointer' }}>
                        <CloseIcon />
                    </div>
                </Toolbar>
            </AppBar>
            <Box sx={{ flexGrow: 1, overflow: 'auto', marginTop: '7vh', width: '100%', mb: 2, paddingRight: 1 }}>
                {filteredEvents.map(event => (
                    <Card variant="outlined" sx={{ display: 'flex', marginBottom: 1, boxShadow: 3, alignItems: 'center'}}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 5 }}>
                            <CardContent sx={{flex: '1 0 auto' }}>
                                <Typography component="div" fontWeight={900} fontSize={15} sx={{maxWidth: 150}}>
                                    {`${event.user_uuid}`}
                                </Typography>
                                <Typography variant="subtitle1" fontSize={13} component="div">
                                    {"+82 1055359909"}
                                </Typography>
                                <Typography variant="subtitle1" fontSize={11} component="div">
                                    {`${event.start_date} - ${event.end_date || '무기한'}`}
                                </Typography>
                            </CardContent>
                        </Box>
                        <CardContent sx={{ display: 'flex', flex: 1 }}>
                            {event.reason === "사망" ? 
                                <Typography component="div" fontWeight={900} color="red" variant="h5">
                                    {`${event.reason}`}
                                </Typography>
                            :
                                <Typography component="div" fontWeight={900} variant="h5">
                                    {`${event.reason}`}
                                </Typography>
                            }                            
                        </CardContent>
                    </Card>                 
                ))}
                
            </Box>
          </Box>
          )}
        </ThemeProvider>
      </Modal>
    );
  }
}

export default DateCalendarReferenceDate;