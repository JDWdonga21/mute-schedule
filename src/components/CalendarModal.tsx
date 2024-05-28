import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Box, Button, Modal, AppBar, Toolbar, Typography, createTheme, ThemeProvider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { addMonths, subMonths, format } from 'date-fns';
import { Event } from './types'; // 이벤트 타입 정의가 포함된 파일
import {toast} from "react-toastify";
import {ReactToastifyOptions} from "../constants/ReactToastifyOptions";
import './CalendarModal.css'

import EventModal from './EventModal';

// 플러그인 등록
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface CalendarEvents {
    title: string;
    start: Date;
    end?: Date;
}

interface DateCalendarReferenceDateState {
  referenceDate: Dayjs;
  displayedMonth: Dayjs;
  selectedDate: Dayjs;
  calenderEvents: CalendarEvents[];
}

interface DateCalendarProps {
  open: boolean;
  onClose: () => void;
  isModalOpenR: boolean;
  onOpenR: () => void;
  onCloseR: () => void;
  events: Event[];  
}

// 색상 팔레트에 새 색상 추가
declare module '@mui/material/styles' {
  interface Palette {
    salmon: Palette['primary'];
  }

  interface PaletteOptions {
    salmon?: PaletteOptions['primary'];
  }
}

// salmon 옵션을 포함하도록 버튼 색상 옵션 업데이트
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    salmon: true;
  }
}

let theme = createTheme({
  // tonalOffset 및/또는을 포함하여 평소와 같이 테마 사용자 정의가 여기에 적용됩니다.
  // AugmentColor() 함수인 ContrastThreshold는 다음을 사용합니다.
});

theme = createTheme(theme, {
  // AugmentColor로 생성된 사용자 정의 색상은 여기로 이동하세요.
  palette: {
    salmon: theme.palette.augmentColor({
      color: {
        main: '#FF5733',
      },
      name: 'salmon',
    }),
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
      calenderEvents: this.convertEventsToCalendarEvents(props.events),
    };
  }

  componentDidUpdate(prevProps: DateCalendarProps, prevState: DateCalendarReferenceDateState) {
    if (prevProps.events !== this.props.events) {
      this.setState({ calenderEvents: this.convertEventsToCalendarEvents(this.props.events) }, () => {
        const calendarApi = this.calendarRef.current?.getApi();
        calendarApi?.refetchEvents();
        this.applyShadeToOtherMonthDays();
      });
    }
    if (prevState.displayedMonth !== this.state.displayedMonth) {
      const calendarApi = this.calendarRef.current?.getApi();
      calendarApi?.gotoDate(this.state.displayedMonth.toDate());
      this.applyShadeToOtherMonthDays();
    }
  }
  
  convertEventsToCalendarEvents(events: Event[]): CalendarEvents[] {
    console.log(events, "전달된 값");
    return events.map(event => ({
      title: event.reason || "",
      start: event.start_date,
      end: event.end_date || undefined
    }));
  }

  handlePrevMonth = () => {
    this.setState((prevState) => ({
      displayedMonth: dayjs(subMonths(prevState.displayedMonth.toDate(), 1)),
    }));
    const calendarApi = this.calendarRef.current?.getApi();
    calendarApi?.prev();
  };

  handleNextMonth = () => {
    this.setState((prevState) => ({
      displayedMonth: dayjs(addMonths(prevState.displayedMonth.toDate(), 1)),
    }));
    const calendarApi = this.calendarRef.current?.getApi();
    calendarApi?.next();
  };

  handleToday = () => {
    const today = dayjs();
    if(!this.props.isModalOpenR){
      this.props.onOpenR();
    }
    this.setState({ displayedMonth: today, selectedDate: today });
    const calendarApi = this.calendarRef.current?.getApi();
    calendarApi?.today();
    toast.success(`오늘 날짜 : ${format(today.toDate(), 'yyyy-MM-dd')}`, ReactToastifyOptions);
  };

  handleDateSelect = (selectInfo: any) => {
    this.setState({ selectedDate: dayjs(selectInfo.start) });
    if(!this.props.isModalOpenR){
      this.props.onOpenR();
    }
    toast.success(`선택한 날짜 : ${selectInfo.startStr}`, ReactToastifyOptions);
  };

  applyShadeToOtherMonthDays = () => {
    setTimeout(() => {
      const calendarEl = document.querySelector('.fc-daygrid-body'); // 달력 본체 요소 선택
      if (calendarEl) {
        const dayEls = calendarEl.querySelectorAll('.fc-day');
        dayEls.forEach(dayEl => {
          const date = new Date(dayEl.getAttribute('data-date') || '');
          if (date.getMonth() !== this.state.displayedMonth.month()) {
            dayEl.classList.add('fc-day-other');
          } else {
            dayEl.classList.remove('fc-day-other');
          }
        });
      }
    }, 0);
  };

  render() {
    const { displayedMonth } = this.state;
    const { open, onClose } = this.props;
    return (
        <Modal
            open={open}
            hideBackdrop
        >
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '35%',
              transform: 'translate(-50%, -50%)',
              width: '65vw',
              bgcolor: 'background.paper',
              boxShadow: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 1,
              borderRadius: 3,
              padding: '12px',
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
                borderBottom: '1px solid',
                justifyContent: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                display: 'flex',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                boxShadow: 3,
              }}
            >
              <Toolbar>
                <Typography fontWeight={900} variant="h6" component="h2" gutterBottom sx={{ flexGrow: 1, marginLeft: 2, marginTop: 1, marginBottom: 1, fontWeight: '700' }}>
                  관제 예외일정
                </Typography>
                <div onClick={onClose} style={{ cursor: 'pointer' }}>
                  <CloseIcon />
                </div>
              </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8vh', width: '100%', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
                <Button variant="contained" onClick={this.handlePrevMonth}>
                  <Typography sx={{fontWeight : '900'}}>
                    이전
                  </Typography>                  
                </Button>

                <Typography variant="h6" component="div" sx={{ marginRight: 4, marginLeft: 4, fontWeight: '900' }}>
                  {format(displayedMonth.toDate(), 'yyyy.MM')}
                </Typography>

                <Button variant="contained" onClick={this.handleNextMonth}>
                  <Typography sx={{fontWeight : '900'}}>
                    다음
                  </Typography>                  
                </Button>
              </Box>
              <Box sx={{ marginLeft: '-10%', marginRight: '2%', alignItems: 'center', justifyContent: 'end' }}>
                <Button variant="contained" color="salmon" onClick={this.handleToday}>
                  <Typography sx={{fontWeight : '900'}}>
                    오늘
                  </Typography>                  
                </Button>
              </Box>
            </Box>

            <Box sx={{ width: '96%', height: 'auto', marginTop: '1vh', marginBottom: '1vh' }}>
              <div className="calendar-scale">
                    <FullCalendar
                      ref={this.calendarRef}
                      plugins={[dayGridPlugin, interactionPlugin]}
                      initialView="dayGridMonth"
                      headerToolbar={false}
                      selectable={true}
                      select={this.handleDateSelect}
                      events={this.state.calenderEvents}
                      eventColor='#5072A8'
                      expandRows
                      contentHeight={'auto'}
                      stickyHeaderDates
                      dayMaxEventRows={true} // 이벤트가 많은 경우 최대 행 수 설정
                      fixedWeekCount={false} // 표시되는 주의 수를 동적으로 변경
                      dayCellDidMount={(info) => {
                        if (info.date.getMonth() !== this.state.displayedMonth.month()) {
                          info.el.classList.add('fc-day-other');
                        }
                      }}
                    />
              </div>              
            </Box>
          </Box>
          {/* 이동한 이벤트 리스트 */}
          {this.props.isModalOpenR && (
            <EventModal onCloseR={this.props.onCloseR} events={this.props.events} selectedDate={this.state.selectedDate}   />
          )}
        </ThemeProvider>
      </Modal>
    );
  }
}

export default DateCalendarReferenceDate;
