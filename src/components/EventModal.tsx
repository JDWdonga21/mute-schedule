import React, { Component } from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText, AppBar, Toolbar, CardContent } from '@mui/material';
import Card from '@mui/material/Card';
import { Event } from './types'; // 이벤트 타입 정의가 포함된 파일

import CloseIcon from '@mui/icons-material/Close';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  events: Event[];
  selectedDate: Date;
}

interface EventModalState {}

class EventModal extends Component<EventModalProps, EventModalState> {
  // 선택된 날짜에 해당하는 이벤트 필터링
  getFilteredEvents = () => {
    const { events, selectedDate } = this.props;
    return events.filter(event => {
      const startDate = new Date(event.start_date);
      const endDate = event.end_date ? new Date(event.end_date) : new Date(event.start_date);
      return startDate <= selectedDate && selectedDate <= endDate;
    });
  }

  render() {
    const { open, onClose, selectedDate } = this.props;
    // const filteredEvents = this.getFilteredEvents();
    const filteredEvents = this.props.events;
    return (
      <Modal 
        open={open} 
        // onClose={(event, reason) => {
        //     if (reason !== 'backdropClick') {
        //       onClose();
        //     }
        // }}    
        hideBackdrop 
      >
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
                        {selectedDate.toLocaleDateString()}
                    </Typography>
                    <div onClick={onClose} style={{ cursor: 'pointer' }}>
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
      </Modal>
    );
  }
}

export default EventModal;
