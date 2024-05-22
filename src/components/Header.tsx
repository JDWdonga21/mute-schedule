import React, {} from "react";
//mui
import { 
    AppBar, 
    Toolbar, 
    Typography, 
} from '@mui/material';
  
class Header extends React.Component<{},{}>{
    render(): React.ReactNode {
        return(
          <AppBar
            position="static"
            color="default"
            elevation={0} 
            sx={{
              width: '100vw',
              height: '10vh',
              paddingTop: '15px',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
              borderBottom: '3px solid',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'fixed',
              top: 0,
              left: 0, 
              display: 'flex',
           }}
          >
            <Toolbar>
              <Typography variant="h4" color="inherit" noWrap sx={{ flexGrow: 1, marginLeft: 2}}>
                관제 예외 설정
              </Typography>              
            </Toolbar>                
          </AppBar>
        )
    }
}

export default Header;
  

