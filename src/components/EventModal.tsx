import React, { Component } from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText, AppBar, Toolbar } from '@mui/material';
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
    const filteredEvents = this.getFilteredEvents();

    return (
      <Modal 
        open={open} 
        onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              onClose();
            }
        }}      
      >
        <Box 
            sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '90%', 
                transform: 'translate(-50%, -50%)', 
                width: 300, 
                bgcolor: 'background.paper', 
                p: 2, 
                overflow: 'auto' 
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '7vh', width: '100%', mb: 2 }}>
                <List>
                {filteredEvents.map(event => (
                <ListItem key={event.id} sx={{ bgcolor: event.status === 1 ? 'error.main' : 'info.main', mb: 1, color: 'background.paper' }}>
                    <ListItemText primary={event.type} secondary={`${event.start_date} - ${event.end_date || 'Ongoing'}`} />
                </ListItem>
                ))}
                </List>
            </Box>
          
        </Box>
      </Modal>
    );
  }
}

export default EventModal;
