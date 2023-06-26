import AppBar from '@mui/material/AppBar';
import { Box, Button, MenuItem } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import { styled, alpha } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import UserAvatar from "./avatar/UserAvatar";
import { Badge, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [showReadNotifications, setShowReadNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/notification/${user._id}`);
        // console.log(response.data);
        setNotifications(response.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    // Fetch notifications initially
    if (user) {
      fetchNotifications();
    }

    // Fetch notifications every 10 seconds
    const intervalId = setInterval(() => {
      if (user) {
        fetchNotifications();
      }
    }, 10000);

    // Cleanup the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, [user]);

  console.log(notifications);

  const styles = {
    backgroundColor: '#282c34',
    color: '#FFF',
    top: 0,
    position: 'fixed',
    zIndex: 100,
  }
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    paddingLeft: 50,
    paddingRight: 50,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setShowReadNotifications(false);
  };
  
  const onLogout = () => {
    dispatch(reset());
    dispatch(logout());
    navigate('/');
  }

  const handleMarkAsRead = async () => {
    // Update the read property of each notification to true
    const updatedNotifications = notifications.map((notification) => {
      return { ...notification, read: true };
    });
    setNotifications(updatedNotifications);

    try {
      // Send API request to update notifications in the database
      await axios.put(`http://localhost:3001/notification/${user._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleReadNotifications = () => {
    setShowReadNotifications(!showReadNotifications);
  };

  let filteredNotifications;
  if (notifications && notifications.length > 0) {
    filteredNotifications = (showReadNotifications === true)
      ? notifications
      : notifications.filter((notification) => !notification.read);
  }

  console.log(showReadNotifications);
  console.log(filteredNotifications);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={styles}>
        <Toolbar variant='dense' style={{paddingLeft: '0px', paddingTop: '5px', paddingBottom: '5px'}}>
          <MenuItem key='Home' onClick={() => navigate("/board")}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <img src="/images/icons8-dashboard-layout-48.png" alt="My Image" style={{maxWidth: '32px', maxHeight: '32px'}}/>   
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 25 }} color="inherit" component="div"
                        children='Taskboard'/>
            </div>
          </MenuItem>
          <Box sx={{ flexGrow: 1 }}/>
          
          {/*Bell and profile icons*/}
          <Box sx={{ display: { xs: 'none', md: 'flex', alignItems: 'center', justifyContent: 'center'} }}>
            {user && (
              <Search>
                <SearchIconWrapper>
                  <SearchIcon/>
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            
            )}
            {user ? (
              <>
                <Box sx={{ marginRight: 3 }}>
                  <Tooltip title="Open Notifications">
                      <IconButton
                          id="basic-button"
                          onClick={handleClick}
                          aria-controls={open ? 'basic-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                          style={{color: '#FFF'}}
                        >
                          <Badge color="error" badgeContent={!showReadNotifications && filteredNotifications ?  filteredNotifications.length : 0} max={50}>
                            <NotificationsIcon />
                          </Badge>
                      </IconButton>
                  </Tooltip>
                  <Menu
                    id="basic-menu"
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 0,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '70px', marginLeft: '15px'}}>
                      <div>
                        <Typography variant="h6" gutterBottom>
                          Notifications
                        </Typography>
                      </div>
                      <div>
                        <FormControlLabel
                        control={
                          <Switch
                          sx={{ m: 1 }}
                          defaultChecked
                          checked={showReadNotifications}
                          onChange={handleToggleReadNotifications}
                          onClick={(event) => event.stopPropagation()}
                          color="primary"
                          inputProps={{ 'aria-label': 'Show Read Notifications' }}
                          />
                        }
                        label="Show Read Notifications"
                        />
                      </div>
                    </div>
                    <Divider variant="middle" style={{marginBottom: '10px'}} />
                    <div className="notification-container" style={{ maxHeight: '400px', overflow: 'auto' }}>
                        {filteredNotifications && filteredNotifications.length > 0 ? (
                          filteredNotifications.map((notification, index) => {
                            if (
                              (notification.card) ||
                              (notification.board) ||
                              (notification.group)
                            ) {
                              return (
                                <MenuItem key={index}>
                                  <Link
                                    to={notification.board ? `/taskboard/${notification.board._id}` : '/board'}
                                    style={{ textDecoration: 'none', color: 'black'}}
                                    onClick={handleMarkAsRead}
                                  >
                                    <div className="notification-item" style={{ margin: '3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      {notification.admin && (
                                        <UserAvatar name={notification.admin.name} color={notification.admin.color} />
                                      )}
                                      <div className="notification-message">
                                        {notification.card && (
                                          <>
                                            {notification.admin.name} assigned you to the card <span style={{ color: 'blue' }}><span style={{ color: 'blue' }}>{notification.card.name}</span></span> {' '}in the board{' '}
                                            <span style={{ color: 'blue' }}>{notification.board.name}</span>
                                          </>
                                        )}
                                        {!notification.card && notification.board &&(
                                          <>
                                            {notification.admin.name}{' '}
                                            {notification.action === "add" ? "added you to" :
                                            notification.action === "role" ? "added you as an admin in" :
                                            notification.action === "assign" ? "assigned a task to you" :
                                            notification.action === "update" ? "updated" :
                                            "deleted"} the board {' '} <span style={{ color: 'blue' }}>{notification.board.name}</span>
                                          </>
                                        )}
                                        {notification.group && (
                                          <>
                                            {notification.admin.name}{' '}
                                            {notification.action === "add" ? "added you to" :
                                            notification.action === "role" ? "added you as an admin in" :
                                            notification.action === "assign" ? "assigned a task to you" :
                                            notification.action === "update" ? "updated" :
                                            "deleted"} the group {' '} <span style={{ color: 'blue' }}>{notification.group.name}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </Link>
                                </MenuItem>
                              );
                            } else {
                              return null;
                            }
                          })
                        ) : (
                          <MenuItem>
                            All the notifications have been read.
                          </MenuItem>
                        )}
                        {filteredNotifications && !showReadNotifications && filteredNotifications.length > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginBottom: '20px', width: '100%' }}>
                            <Button variant="contained" style={{ width: '95%' }} onClick={handleMarkAsRead}>
                              Mark as read
                            </Button>
                          </div>
                        )}
                      </div>
                  </Menu>
                </Box>
                <Box>
                  <Tooltip title="Open settings">
                    <div style={styles.avatar} onClick={handleOpenUserMenu}>
                      <UserAvatar name={user.name} color={user.color} />
                    </div>
                  </Tooltip>
                  <Menu
                    id="basic-menu"
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        minWidth: '200px',
                        mt: 0,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    onClick={handleCloseUserMenu}
                  >
                    <MenuItem onClick={() => navigate(`/profile/${user._id}`)}>
                      <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                        <PersonOutlineIcon/>
                        <Typography textAlign="center">Edit Profile</Typography>
                      </div>
                    </MenuItem>
                    <Divider variant="middle" />
                    <MenuItem key="menus" onClick={handleCloseUserMenu}>
                      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <LogoutIcon/>
                        <Typography textAlign="center" onClick={onLogout}>Logout</Typography>
                      </div>
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            ) : (
              <Box>
                <Button onClick={() => navigate("/login")} style={{color: 'white'}}>
                  Login
                </Button>
                
                <Button onClick={() => navigate("/register")} style={{color: 'white'}}>
                  Register
                </Button>
              </Box>
            )}
          </Box>
        
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header