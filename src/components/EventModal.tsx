import React, { Component } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Modal, Box, Typography, List, ListItem, ListItemText, AppBar, Toolbar, CardContent } from '@mui/material';
import Card from '@mui/material/Card';
import { Event } from './types'; // 이벤트 타입 정의가 포함된 파일
import { addMonths, subMonths, format } from 'date-fns';

import CloseIcon from '@mui/icons-material/Close';

interface EventModalProps {
//   open: boolean;
    onCloseR: () => void;
    events: Event[];
    selectedDate: Dayjs;
}

interface EventModalState {}

class EventModal extends Component<EventModalProps, EventModalState> {
  // 선택된 날짜에 해당하는 이벤트 필터링
  getFilteredEvents = (): Event[] => {
    const { events } = this.props;
    const { selectedDate } = this.props;
    return events.filter(event => {
      const startDate = dayjs(event.start_date);
      const endDate = event.end_date ? dayjs(event.end_date) : startDate;
  
      return (
        startDate.isSameOrBefore(selectedDate, 'day') && 
        endDate.isSameOrAfter(selectedDate, 'day')
      ) || 
      startDate.isSame(selectedDate, 'day');
    });
  };

  render() {
    const { onCloseR, selectedDate } = this.props;
    const filteredEvents = this.getFilteredEvents();
    return (
        <Box 
            sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '85%', 
                transform: 'translate(-50%, -50%)', 
                width: 400, 
                height: '70vh', // 스크롤을 활성화하려면 모달의 고정 높이를 설정하세요.
                bgcolor: 'background.paper', 
                p: 2, 
                overflow: 'hidden', // 모달 상자 자체에서 오버플로 숨기기
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
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
                  boxShadow: 3,
                }}
            >
                <Toolbar>
                    <Typography fontWeight={900} variant="h6" component="h2" gutterBottom sx={{ flexGrow: 1, marginTop: 1, marginBottom: 1, fontSize: 22 }}>
                        {format(selectedDate.toDate(), 'yyyy.MM.dd')}
                    </Typography>
                    <div onClick={onCloseR} style={{ cursor: 'pointer' }}>
                        <CloseIcon />
                    </div>
                </Toolbar>
            </AppBar>
            <Box sx={{ flexGrow: 1, overflow: 'auto', marginTop: '7vh', width: '100%', mb: 2, paddingRight: 1 }}>
            {filteredEvents.map(event => (
                    <Card key={event.id} variant="outlined" sx={{ display: 'flex', marginBottom: 1, boxShadow: 3, alignItems: 'center'}}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 5 }}>
                            <CardContent sx={{flex: '1 0 auto' }}>
                                <Typography component="div" fontWeight={900} fontSize={15} sx={{maxWidth: 150}}>
                                    {`${event.user_uuid}`}
                                </Typography>
                                <Typography variant="subtitle1" fontSize={13} component="div">
                                    {"+82 1055359909"}
                                </Typography>
                                {event.end_date !== null ? 
                                  <Typography variant="subtitle1" fontSize={11} component="div">
                                    {`${format(event.start_date,'yyyy-MM-dd')} - ${format(event.end_date, 'yyyy-MM-dd')}`}
                                  </Typography>
                                :
                                  <Typography variant="subtitle1" fontSize={11} component="div">
                                    {`${format(event.start_date,'yyyy-MM-dd')} - 무기한`}
                                  </Typography>
                                }
                                
                            </CardContent>
                        </Box>
                        <CardContent sx={{ display: 'flex', flex: 1 }}>
                          {event.reason === null ? 
                            <Typography component="div" fontWeight={900} variant="h5">
                              없음
                            </Typography>
                           :
                            event.reason === "사망" ? 
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
    );
  }
}

export default EventModal;
