import React from 'react';
import logo from './logo.svg';
import './App.css';

// components, modals
import Header from './components/Header';
import CalendarModal from './components/CalendarModal';
import EventModal from './components/EventModal';

//데이터
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
  // 모달 상태
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
  // 모달 열고 닫는 메서드
  /**
   * 1. 좌측 및 우측 모달이 동시에 표시된다
   * 2. 좌측 모달의 닫기를 누르면 좌/우측 모달 모두 닫힌다
   * 3. 우측 모달의 닫기를 누르면 우측 모달만 닫힌다
   */
  handleOpenModal = () => {
    this.setState({ 
      isModalOpenL: true,
      isModalOpenR: true,
     });
  };
  //좌측 닫기
  handleCloseModalL = () => {
    this.setState({ 
      isModalOpenL: false,
      isModalOpenR: false,
    });
  };
  //우측 닫기
  handleCloseModalR = () => {
    this.setState({ 
      isModalOpenR: false,
    });
  };
  //좌측 열기
  handleOpenModalL = () => {
    this.setState({ 
      isModalOpenL: true,
     });
  };
  //우측 열기
  handleOpenModalRR = () => {
    this.setState({
      isModalOpenR: true,
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
          zIndex: 2,
        }}
      >
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
            // defaultValue="Default Value"
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
        {/* 모달 설정 좌측 달력*/}
        <Modal
              open={this.state.isModalOpenL}
              onClose={this.handleCloseModalL}
              style={{ border: 'none', overflow: 'hidden' }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
            <Box sx={{ 
              position: 'absolute',
              top: '50%',
              left: '25%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // height: '80vh',
              border: '2px solid #000000',
              zIndex: 1
            }}>
              <CalendarModal/>
            </Box>
        </Modal>
        {/* 모달 설정 우측 리스트 */}
        <Modal
              open={this.state.isModalOpenR}
              onClose={this.handleCloseModalR}
              style={{ border: 'none', overflow: 'hidden' }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
            <Box sx={{ 
              position: 'absolute',
              top: '50%',
              left: '75%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // height: '80vh',
              border: '2px solid #000000',
              zIndex: 1
            }}>
              <EventModal
                open={this.state.isModalOpenR}
                onClose={this.handleCloseModalR}
                events={sampleData}
                selectedDate={new Date()} // 예제에서는 단순히 현재 날짜를 전달합니다.
              />
            </Box>
          </Modal>
      </Container>            
    );
  }
}

export default App;