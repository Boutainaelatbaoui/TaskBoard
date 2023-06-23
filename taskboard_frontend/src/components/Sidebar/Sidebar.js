import { useEffect, useState } from "react";
import axios from "axios";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import BoardSearch from "../Board/BoardSearch";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Popup from "../../pages/Board/Popup";
import BoardForm from "../Board/BoardForm";
import { useSelector } from "react-redux";
import './sidebar.css';

function Sidebar({ showSidebar, setShowSideBar }) {
  const [listBoards, setListBoards] = useState([]);
  const [searched, setSearched] = useState("");
  const [recordUpdate, setRecordUpdate] = useState("");
  const [openGroupForm, setOpenGroupForm] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const { user } = useSelector((state) => state.auth);
  
  const token = user.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  
  const hideSideBar = () => {
    setShowSideBar(!showSidebar);
  }
  
  const getListBoards = async () => {
    try {
      const b = await axios.get("http://localhost:3001/board", config);
      setListBoards(b.data);
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    getListBoards();
  }, [listBoards]);
  
  const SidebarItems = listBoards.map((list, index) => ({
    id: index,
    title: list.name,
    icon: <DashboardIcon/>,
    path: `taskboard/${list._id}`,
      cName: 'side-text'
  }));
  
  return (
    <>
      <nav className={showSidebar ? 'sidebar active' : 'sidebar'}>
        <ul className='side-menu-items'>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '25px', marginLeft: '15px'}}>
              {/* <BoardSearch searched={searched} setSearched={setSearched}/> */}
              <Typography textAlign="center" variant="h5">MENU</Typography>
              <div className='direction' style={{cursor: 'pointer'}}>
                <KeyboardDoubleArrowLeftIcon className='chevronLeft chevron' onClick={hideSideBar} />
                <KeyboardDoubleArrowRightIcon className={showSidebar ? 'chevronRight chevron' : 'chevron'} onClick={hideSideBar}/>
              </div>
              
            </div>
          <div style={{
            marginTop: 40,
            paddingLeft: 20,
            paddingRight: 15,
            paddingBottom: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            color: '#FFF',
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
              <img src="/images/icons8-dashboard-32.png" alt="My Image" style={{ maxWidth: '20px', maxHeight: '20px', marginRight: '8px' }}/>
              <p>Boards</p>
            </div>
            <AddIcon sx={{
              '&:hover': {
                backgroundColor: '#112162',
                borderRadius: 1,
                cursor: 'pointer'
              }
            }} onClick={() => setOpenPopup(true)}/>
          </div>
          {SidebarItems.filter((item) => item.title.toLowerCase().includes(searched.toLowerCase()))
            .map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    <img src="/images/icons8-project-24 (1).png" alt="My Image" style={{ maxWidth: '20px', maxHeight: '20px'}}/>
                    <span>{item.title}</span>
                  </Link>
                </li>
              )
            })}
        </ul>
      </nav>
      <Popup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        setRecordUpdate={setRecordUpdate}
        recordUpdate={recordUpdate}
        title={"New board"}
      >
        <BoardForm
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          recordUpdate={recordUpdate}
        />
      </Popup>
    </>
  );
}

export default Sidebar;
