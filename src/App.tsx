import React from 'react';
import './App.css';

// components, modals
import Header from './components/Header';
import CalendarModal from './components/CalendarModal';
import EventModal from './components/EventModal';

// 데이터
import sampleData from './data/data.json';

// mui
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { purple } from '@mui/material/colors';

const MuteButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: '#b0bec5',
  '&:hover': {
    backgroundColor: '#cfd8dc',
  },
  width: '100%',
  marginTop: theme.spacing(2), // add spacing above the button
  padding: theme.spacing(1.5), // add padding to the button for a better look
  borderRadius: theme.shape.borderRadius * 2, // round the corners more
  boxShadow: theme.shadows[3], // add a subtle shadow
}));

type AppState = {
  isModalOpenL: boolean;
  isModalOpenR: boolean;
  isdarkTheme: boolean;
};

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isModalOpenL: false,
      isModalOpenR: false,
      isdarkTheme: false,
    };
  }

  handleOpenModal = () => {
    this.setState({ 
      isModalOpenL: true,
      isModalOpenR: true,
    });
  };

  handleCloseModalL = () => {
    this.setState({ 
      isModalOpenL: false,
      isModalOpenR: false,
    });
  };

  handleCloseModalR = () => {
    this.setState({ 
      isModalOpenR: false,
    });
  };

  render(): React.ReactNode {
    return (
      <Container
        maxWidth="lg"
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          padding: '0',
          backgroundColor: 'background.default',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2}}>
          <Header />
          <Box
            sx={{
              width: '70%',
              display: 'flex',
              flexDirection: 'column', // stack children vertically
              alignItems: 'center',
              justifyContent: 'center',
              position: 'fixed',
              top: '10vh',
            }}
          >
            <TextField
              id="filled-multiline-static"
              label="예외 JSON 입력"
              multiline
              rows={15}
              fullWidth
              placeholder='{
                "id": 109,
                "created_at": "2024-05-21 07:34:09",
                "updated_at": "2024-05-21 07:34:16",
                "user_uuid": "0x4E93587B95E24DC1B59DF34C5509D7F3",
                "type": "LA_DOOR_CLOSED",
                "start_date": "2024-05-16 15:00:00",
                "end_date": "2024-05-17 15:00:00",
                "reason": "외출",
                "description": "",
                "status": 1,
                "create_user_uuid": "0x4E93587B95E24DC1B59DF34C5509D7F3"
              }'
              variant="filled"
            />
            <MuteButton variant="contained" onClick={this.handleOpenModal}>예외 입력(모달 발생 버튼)</MuteButton>
          </Box>
        </div>

        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1}}>
          {/* 모달 설정 좌측 달력 */}
          <Modal
            open={this.state.isModalOpenL}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                this.handleCloseModalL();
              }
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{ 
              position: 'absolute',
              top: '50%',
              left: '25%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #000000',
              zIndex: 1,
              backgroundColor: 'background.paper',
              padding: 2,
            }}>
              <CalendarModal open={this.state.isModalOpenL} onClose={this.handleCloseModalL} />
            </Box>
          </Modal>
          {/* 모달 설정 우측 리스트 */}
          <Modal
            open={this.state.isModalOpenR}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                this.handleCloseModalR();
              }
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{ 
              position: 'absolute',
              top: '50%',
              left: '75%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #000000',
              zIndex: 1,
              backgroundColor: 'background.paper',
              padding: 2,
            }}>
              <EventModal
                open={this.state.isModalOpenR}
                onClose={this.handleCloseModalR}
                events={sampleData}
                selectedDate={new Date()} // 예제에서는 단순히 현재 날짜를 전달합니다.
              />
            </Box>
          </Modal>
        </div>
      </Container>
    );
  }
}

export default App;