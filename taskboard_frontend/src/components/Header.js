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
                              checked={showReadNotifications} onChange={handleToggleReadNotifications}
                              onClick={(event) => event.stopPropagation()}
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