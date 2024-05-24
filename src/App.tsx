import React from 'react';
import './App.css';

// components, modals
import Header from './components/Header';
import CalendarModal from './components/CalendarModal';
// import EventModal from './components/EventModal';

// 데이터
import { Event } from './components/types';
import sampleData from './data/data.json';

// mui
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { purple } from '@mui/material/colors';

//React-Toastify
import {toast} from "react-toastify";
import { ToastContainer } from 'react-toastify';
import {ReactToastifyOptions} from "./constants/ReactToastifyOptions";
import 'react-toastify/dist/ReactToastify.css';

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
  jsonInput: string;
  jsonArray: Event[];
  isModalOpenL: boolean;
  isModalOpenR: boolean;
  isdarkTheme: boolean;
};

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      jsonInput: '',
      jsonArray: [],
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

  handleOpenModalR = () => {
    this.setState({ 
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

  // JSON validation 함수
  // validateJson = (jsonString: string): Event[] | null => {
  //   try {
  //     const parsedArray = JSON.parse(jsonString);
  //     if (Array.isArray(parsedArray)) {
  //       // 추가적인 타입 체크
  //       for (const item of parsedArray) {
  //         if (
  //           typeof item.id !== 'number' ||
  //           isNaN(Date.parse(item.created_at)) ||
  //           isNaN(Date.parse(item.updated_at)) ||
  //           typeof item.user_uuid !== 'string' ||
  //           typeof item.type !== 'string' ||
  //           isNaN(Date.parse(item.start_date)) ||
  //           (item.end_date !== null && isNaN(Date.parse(item.end_date))) ||
  //           typeof item.reason !== 'string' ||
  //           typeof item.description !== 'string' ||
  //           typeof item.status !== 'number' ||
  //           typeof item.create_user_uuid !== 'string'
  //         ) {
  //           return null;
  //         }
  //       }
        
  //       // 날짜 형식 변환
  //       const convertedArray = parsedArray.map((item: any) => ({
  //         ...item,
  //         created_at: new Date(item.created_at),
  //         updated_at: new Date(item.updated_at),
  //         start_date: new Date(item.start_date),
  //         end_date: item.end_date ? new Date(item.end_date) : null,
  //       }));
  
  //       console.log(sampleData);
  //       console.log(convertedArray);
  //       return convertedArray;
  //     }
  //     return null;
  //   } catch (e) {
  //     return null;
  //   }
  // };
  validateJson = (jsonString: string): Event[] | null => {
    try {
      const parsedArray = JSON.parse(jsonString);
      if (Array.isArray(parsedArray)) {
        // 추가적인 타입 체크
        for (const item of parsedArray) {
          if (typeof item.id !== 'number') {
            toast.error(`Invalid id: ${item.id}`, ReactToastifyOptions);
            toast.error(`id는 number 타입이어야 합니다`, ReactToastifyOptions);
            return null;
          }
          if (isNaN(Date.parse(item.created_at))) {
            toast.error(`Invalid created_at: ${item.created_at}`, ReactToastifyOptions);
            toast.error(`created_at는 유효한 날짜 형식이어야 합니다`, ReactToastifyOptions);
            return null;
          }
          if (isNaN(Date.parse(item.updated_at))) {
            toast.error(`Invalid updated_at: ${item.updated_at}`, ReactToastifyOptions);
            toast.error(`updated_at는 유효한 날짜 형식이어야 합니다`, ReactToastifyOptions);
            return null;
          }
          if (typeof item.user_uuid !== 'string') {
            toast.error(`Invalid user_uuid: ${item.user_uuid}`, ReactToastifyOptions);
            toast.error(`user_uuid는 string 타입이어야 합니다`, ReactToastifyOptions);
            return null;
          }
          if (typeof item.type !== 'string') {
            toast.error(`Invalid type: ${item.type}`, ReactToastifyOptions);
            toast.error(`type은 string 타입이어야 합니다`, ReactToastifyOptions);
            return null;
          }
          if (isNaN(Date.parse(item.start_date))) {
            toast.error(`Invalid start_date: ${item.start_date}`, ReactToastifyOptions);
            toast.error(`start_date는 유효한 날짜 형식이어야 합니다`, ReactToastifyOptions);
            return null;
          }
          if (item.end_date !== null && isNaN(Date.parse(item.end_date))) {
            toast.error(`Invalid end_date: ${item.end_date}`, ReactToastifyOptions);
            toast.error(`end_date는 유효한 날짜 형식이어야 합니다`, ReactToastifyOptions);
            return null;
          }
          if (item.reason !== null && typeof item.reason !== 'string') {
            toast.error(`Invalid reason: ${item.reason}`, ReactToastifyOptions);
            toast.error(`reason은 string 타입이어야 합니다`, ReactToastifyOptions);
            return null;
          }
          if (item.description !== null && typeof item.description !== 'string') {
            toast.error(`Invalid description: ${item.description}`, ReactToastifyOptions);
            toast.error(`description은 string 타입이어야 합니다`, ReactToastifyOptions);
            return null;
          }
          if (typeof item.status !== 'number') {
            toast.error(`Invalid status: ${item.status}`, ReactToastifyOptions);
            toast.error(`status는 number 타입이어야 합니다`, ReactToastifyOptions);
            return null;
          }
          if (typeof item.create_user_uuid !== 'string') {
            toast.error(`Invalid create_user_uuid: ${item.create_user_uuid}`, ReactToastifyOptions);
            toast.error(`create_user_uuid는 string 타입이어야 합니다`, ReactToastifyOptions);
            return null;
          }
        }
  
        // 날짜 형식 변환
        const convertedArray = parsedArray.map((item: any) => ({
          ...item,
          created_at: new Date(item.created_at),
          updated_at: new Date(item.updated_at),
          start_date: new Date(item.start_date),
          end_date: item.end_date ? new Date(item.end_date) : null,
        }));
  
        console.log(sampleData);
        console.log(convertedArray);
        return convertedArray;
      }
      toast.error('잘못된 JSON 배열: 배열이 아닙니다.', ReactToastifyOptions);
      return null;
    } catch (e : any) {
      const errorSummary = e.message.split(':').slice(0, 2).join(':'); // 첫 번째와 두 번째 부분만 추출하여 요약
      toast.error(`잘못된 JSON 배열`, ReactToastifyOptions);
      toast.error(`${errorSummary}`, ReactToastifyOptions);
      return null;
    }
  };
  

  // 버튼 클릭 핸들러
  handleButtonClick = () => {
    const validatedArray = this.validateJson(this.state.jsonInput);
    if (validatedArray) {
      this.setState({ jsonArray: validatedArray });
      this.handleOpenModal();
    } else {
      // alert('Invalid JSON Array');
      // toast.error('Invalid JSON Array(잘못된 JSON 배열)', ReactToastifyOptions);
    }
  };
  //TextField 내용 입력 핸들러
  handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ jsonInput: e.target.value });
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
              top: '11vh',
            }}
          >
            <TextField
              id="filled-multiline-static"
              label="예외 JSON 입력"
              multiline
              rows={15}
              fullWidth
              value={this.state.jsonInput}
              onChange={this.handleInputChange}
              placeholder='[
                {
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
                }
              ]'
              variant="filled"
            />
            <MuteButton variant="contained" onClick={this.handleButtonClick}>예외 입력(모달 발생 버튼)</MuteButton>
          </Box>
        </div>

        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1}}>
          {/* 모달 */}
          <Modal
            open={this.state.isModalOpenL}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                this.handleCloseModalL();
              }
            }}
            // hideBackdrop
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            
            <Box sx={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
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
              {/* 모달 설정 좌측 캘린더, 우측 리스트 */}
              {this.state.isModalOpenL && (
                <CalendarModal open={this.state.isModalOpenL} onClose={this.handleCloseModalL} isModalOpenR={this.state.isModalOpenR} onOpenR={this.handleOpenModalR} onCloseR={this.handleCloseModalR} events={this.state.jsonArray} />
              )}                          
            </Box>
          </Modal>
        </div>
        {/* 토스트 */}
        <ToastContainer />
      </Container>
    );
  }
}

export default App;