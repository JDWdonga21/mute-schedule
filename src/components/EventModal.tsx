import React from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Event } from './types'; // 이벤트 타입 정의가 포함된 파일

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  events: Event[];
  selectedDate: Date;
}

const EventModal: React.FC<EventModalProps> = ({ open, onClose, events, selectedDate }) => {
  // 선택된 날짜에 해당하는 이벤트 필터링
  const filteredEvents = events.filter(event => {
    const startDate = new Date(event.start_date);
    const endDate = event.end_date ? new Date(event.end_date) : new Date(event.start_date);
    return startDate <= selectedDate && selectedDate <= endDate;
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '90%', transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper', p: 2, overflow: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{selectedDate.toLocaleDateString()}</Typography>
        <List>
          {filteredEvents.map(event => (
            <ListItem key={event.id} sx={{ bgcolor: event.status === 1 ? 'error.main' : 'info.main', mb: 1, color: 'background.paper' }}>
              <ListItemText primary={event.type} secondary={`${event.start_date} - ${event.end_date || 'Ongoing'}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default EventModal;