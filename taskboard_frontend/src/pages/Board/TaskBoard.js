import AddList from "../../components/List/AddList";
import List from "../../components/List/List";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import Popup from "./Popup";
import InviteMember from '../../components/Member/InviteMember';
import InviteGroup from '../../components/Member/InviteGroup';
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import RightSidebar from "../../components/Sidebar/RightSidebar";
import UserAvatar from "../../components/avatar/UserAvatar";
import PositionedPopper from './Popper';
import { format } from "date-fns";
import GroupsIcon from '@mui/icons-material/Groups';
import Avatar from '@mui/material/Avatar';
import { avatarColors } from '../../data/avatarColors';

const Board = () => {
  // States
  const [toggleNewList, setToggleNewList] = useState(false);
  const [boardLists, setBoardLists] = useState([]);
  const [boardTitle, setBoardTitle] = useState("");
  const [recordUpdate, setRecordUpdate] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openTeamPopup, setOpenTeamPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showRightSidebar, setShowRightSideBar] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [invitedMembers, setInvitedMembers] = useState([]);
  const [searched, setSearched] = useState({ search: "", members: [], dateRange: [null, null] });
  const [filteredCards, setFilteredCards] = useState([]);
  
  const compStartDate = (card, firstDate) => {
    const cardDate = new Date(card.createdAt);
    if (!firstDate) {
      return true
    }
    // comparing years
    if (cardDate.getFullYear() > firstDate.getFullYear()) return true;
    if (cardDate.getFullYear() < firstDate.getFullYear()) return false;
    if (cardDate.getFullYear() === firstDate.getFullYear()) {
      // comparing months
      if (cardDate.getMonth() + 1 > firstDate.getMonth() + 1) return true;
      if (cardDate.getMonth() + 1 < firstDate.getMonth() + 1) return false;
      if (cardDate.getMonth() + 1 === firstDate.getMonth() + 1) {
        // Comparing days
        if (cardDate.getDate() > firstDate.getDate()) return true;
        if (cardDate.getDate() + 1 < firstDate.getDate() + 1) return false;
        if (cardDate.getDate() + 1 === firstDate.getDate() + 1) {
          return true
        }
      }
    }
  }
  const compEndDate = (card, endDate) => {
    const cardDate = new Date(card.createdAt);
    if (!endDate) {
      return true
    }
    // comparing years
    if (cardDate.getFullYear() < endDate.getFullYear()) return true;
    if (cardDate.getFullYear() > endDate.getFullYear()) return false;
    if (cardDate.getFullYear() === endDate.getFullYear()) {
      // comparing months
      if (cardDate.getMonth() + 1 < endDate.getMonth() + 1) return true;
      if (cardDate.getMonth() + 1 > endDate.getMonth() + 1) return false;
      if (cardDate.getMonth() + 1 === endDate.getMonth() + 1) {
        // Comparing days
        if (cardDate.getDate() < endDate.getDate()) return true;
        if (cardDate.getDate() + 1 > endDate.getDate() + 1) return false;
        if (cardDate.getDate() + 1 === endDate.getDate() + 1) {
          return true
        }
      }
    }
  }
  
  const BoardStyle = {
    paddingTop: 15,
    backgroundColor: "#fff",
    minHeight: "86vh",
    display: "flex",
    alignItems: "flex-start",
    leftSide: {
      marginRight: '20px',
      marginLeft: '20px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '20px',
      paddingBottom: '15px',
    },
    title: {
      fontWeight: 'bold',
      fontSize: "1.5rem",
      color: "black",
    },
    members: {
      marginLeft: 2,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    separator: {
      height: 18, borderRight: '1px solid #a6a6a6', marginRight: 7
    },
    membersAvatars: {
      display: 'flex',
      flexDirection: 'row'
    },
    historyButton: {
      transition: 'background-color 100ms',
      color: "#FFF",
      backgroundColor: '#294db6',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px',
      paddingLeft: '9px',
      paddingRight: '9px',
      borderRadius: '8px',
      cursor: 'pointer',
      '&:hover': {
        color: "#000"
      }
    },
    rightSide: {
      marginRight: '20px',
      marginLeft: '22px',
      display: 'flex',
      alignItems: 'center',
      paddingBottom: '20px',
      justifyContent: 'space-between',
    }
  };
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // getting board data from DB
  const getSingleBoard = async () => {
    if (!user) return;
    const token = user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    try {
      const response = await axios.get(`http://localhost:3001/board/${id}`, config);
      setBoardTitle(response.data.name);
      setBoardLists(response.data.lists);
    } catch (err) {
      console.log(err);
    }
  };
  
  // update DB while dragging cards
  const updateLists = async (source, destination) => {
    const sourceList = {
      ...boardLists.filter((list) => list._id === source.droppableId)[0],
    };
    const destinationList = {
      ...boardLists.filter((list) => list._id === destination.droppableId)[0],
    };
    const draggedCard = sourceList.cards.splice(source.index, 1)[0];
    destinationList.cards.splice(destination.index, 0, draggedCard);
    if (sourceList._id === destinationList._id) {
      try {
        const cards = sourceList.cards.map((card) => card._id);
        await axios.patch(`http://localhost:3001/list/${sourceList._id}`, {
          cards: cards,
        });
        getSingleBoard();
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const sourceCards = sourceList.cards.map((card) => card._id);
        const destinationCards = destinationList.cards.map((card) => card._id);
        if (destinationList.name.toLowerCase() === 'done') {
          await axios.patch(`http://localhost:3001/card/${draggedCard._id}`, {
            deliveryDate: new Date(),
            list_id: destinationList._id,
          });
        } else {
          await axios.patch(`http://localhost:3001/card/${draggedCard._id}`, {
            list_id: destinationList._id,
          });
        }
        //update sourceList
        await axios.patch(`http://localhost:3001/list/${sourceList._id}`, {
          cards: sourceCards,
        });
        // update destination list
        await axios.patch(`http://localhost:3001/list/${destinationList._id}`, {
          cards: destinationCards,
        });
        getSingleBoard();
      } catch (err) {
        console.log(err);
      }
    }
  }
  // const updateBoard = async (newBoardList)
  const updateBoard = async (source, destination) => {
    if (!user) return;
    const token = user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const newBoard = boardLists;
    const draggedList = newBoard.splice(source.index, 1)[0];
    newBoard.splice(destination.index, 0, draggedList);
    const newBoardLists = newBoard.map((list) => list._id);
    try {
      await axios.patch(`http://localhost:3001/board/${id}`, {
        lists: newBoardLists,
      }, config);
    } catch (err) {
      console.log(err);
    }
    setBoardLists(newBoard);
  };
  // get Members
  const getAllMembers = async () => {
    if (!user) return;
    const token = user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    try {
      // get invited members
      const response2 = await axios.get(`http://localhost:3001/member/${id}`);
      const allInvitedMember = response2.data.map((member) => (
        { _id: member.user._id, name: member.user.name, email: member.user.email, role: member.role, color: member.user.color }
      ))
      setInvitedMembers(allInvitedMember);
      // get All members
      const response1 = await axios.get("http://localhost:3001/member", config);
      const Member = response1.data.map((member) => ({ _id: member._id, name: member.name, email: member.email, color: member.color }));
      // checking for duplicated values
      for (let i = 0; i < allInvitedMember.length; i++) {
        const index = Member.findIndex((mem) => {
          return mem._id === allInvitedMember[i]._id;
        })
        Member.splice(index, 1);
      }
      setAllMembers(Member);
      console.log(Member);
    } catch (err) {
      console.log(err)
    }
  }
  // get Groups
  const getAllGroups = async () => {
    if (!user) return;
    const token = user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    try {
      // get All groups
      const response1 = await axios.get("http://localhost:3001/group", config);
      const Group = response1.data.map((group) => ({ _id: group._id, name: group.name, color: group.color}));
      setAllGroups(Group);
      console.log(Group);
    } catch (err) {
      console.log(err)
    }
  }
  // handle on drag
  const handleOnDragEnd = (result) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (type === "list") {
      updateBoard(source, destination);
    } else {
      updateLists(source, destination);
    }
  };
  
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      getSingleBoard();
      getAllMembers();
      getAllGroups();
      setIsLoading(false);
    }, 300);
  }, [id]);
  
  useEffect(() => {
    const fCards = [];
    boardLists.map((list) => (
      list.cards.map((card) => (
        ((card.name.toLowerCase().includes(searched.search.toLowerCase()) || (card.label && card.label.title.toLowerCase().includes(searched.search.toLowerCase()))) &&
          ((searched.members.length <= 0 ? true : searched.members.includes(card.cardPermissions.map((per) =>
            (per.user.name))[0]))) && (compStartDate(card, searched.dateRange[0]) && compEndDate(card, searched.dateRange[1])))
        && (fCards.push({
          name: card.name,
          status: list.name,
          createdAt: format(new Date(card.createdAt), "dd-MM-yyyy"),
          dueDate: card.dueDate != null ? format(new Date(card.dueDate), "dd-MM-yyyy") : "Not assigned yet",
          deliveryDate: card.deliveryDate != null ? format(new Date(card.deliveryDate), "dd-MM-yyyy") : "Not delivered yet",
        }))
      ))
    ))
    setFilteredCards([...fCards]);
  }, [searched])
  
  if (isLoading) {
    return <Spinner/>;
  }
  
  return (
    <div style={{height: '93vh', marginTop: '50px'}}>
      <DragDropContext onDragEnd={handleOnDragEnd}>
          <div style={BoardStyle.leftSide}>
            <p style={BoardStyle.title}>{boardTitle}</p>
            <div style={BoardStyle.members}>
              <div className='membersAvatars' style={BoardStyle.membersAvatars}>
                {invitedMembers.map((member) => (
                  <UserAvatar key={member.name} name={member.name} color={member.color}/>
                ))}
              </div>
              {/*Share*/}
              <Button variant='contained' sx={{ padding: '0.5rem 1rem', marginLeft: 0.7, fontSize: '0.8rem', borderRadius: '1rem', backgroundColor: '#315fe9' }}
                      onClick={() => setOpenPopup(true)}>
                <img src="/images/icons8-user-90.png" alt="My Image" style={{ maxWidth: '18px', maxHeight: '18px', marginRight: '8px' }}/> Add Member
              </Button>
            </div>
          </div>
        <div style={BoardStyle.rightSide} className='rightSide'>
          <div style={BoardStyle.members}>
            <div className='membersAvatars' style={BoardStyle.membersAvatars}>
              {invitedMembers.map((group) => (
                <Avatar style={{ backgroundColor: avatarColors[group.color], color: '#FFFFFF'}}>
                  <GroupsIcon />
              </Avatar>
              ))}
            </div>
            {/*Share with teams*/}
            <Button variant='contained' sx={{ padding: '0.5rem 1rem', marginLeft: 0.7, fontSize: '0.8rem', borderRadius: '1rem', backgroundColor: '#315fe9' }}
                    onClick={() => setOpenTeamPopup(true)}>
              <img src="/images/icons8-team-48.png" alt="My Image" style={{ maxWidth: '18px', maxHeight: '18px', marginRight: '8px' }}/> Add Team
            </Button>
          </div>
          <div style={{ ...BoardStyle.members, gap: '14px' }}>
            {/*filter*/}
            <PositionedPopper searched={searched} setSearched={setSearched} invitedMembers={invitedMembers}
                                  filteredCards={filteredCards} boardLists={boardLists}/>
                {/*// Show menu button*/}
                <div style={BoardStyle.historyButton} className="historyButton"
                    onClick={() => setShowRightSideBar(!showRightSidebar)}>
                  <MenuOpenIcon sx={{ fontSize: 18, marginRight: 1 }}/> Show Activities
                </div>
          </div>
        </div>
        <div style={{overflowX: 'auto', overflowY: 'hidden'}}>
          <Droppable droppableId="board" type="list" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={BoardStyle}
              >
                {boardLists.map((list, index) => (
                  <List
                    index={index}
                    key={list._id}
                    list={list}
                    boardLists={boardLists}
                    setBoardLists={setBoardLists}
                    searched={searched}
                    compStartDate={compStartDate}
                    compEndDate={compEndDate}
                    invitedMembers={invitedMembers}
                    setInvitedMembers={setInvitedMembers}
                  />
                ))}
                {provided.placeholder}
                <AddList
                  toggleNewList={toggleNewList}
                  setToggleNewList={setToggleNewList}
                  boardLists={boardLists}
                  setBoardLists={setBoardLists}
                  boardId={id}
                />
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
      <Popup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        setRecordUpdate={setRecordUpdate}
        recordUpdate={recordUpdate}
        title={"Share board"}
      >
        <InviteMember
          allMembers={allMembers}
          setAllMembers={setAllMembers}
          invitedMembers={invitedMembers}
          setInvitedMembers={setInvitedMembers}
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          recordUpdate={recordUpdate}
          user={user}
          boardId={id}
          boardName={boardTitle}
        />
      </Popup>

      <Popup
        openPopup={openTeamPopup}
        setOpenPopup={setOpenTeamPopup}
        setRecordUpdate={setRecordUpdate}
        title={"Share this board with other members"}
      >
        <InviteGroup
          allGroups={allGroups}
          setAllGroups={setAllGroups}
          openTeamPopup={openTeamPopup}
          setOpenTeamPopup={setOpenTeamPopup}
          invitedMembers={invitedMembers}
          setInvitedMembers={setInvitedMembers}
          user={user}
          boardId={id}
          boardName={boardTitle}
        />
      </Popup>
      
      {/*Right Sidebar*/}
      <RightSidebar
        showRightSidebar={showRightSidebar}
        setShowRightSideBar={setShowRightSideBar}
        boardId={id}
        boardLists={boardLists}
      />
    </div>
  );
};

export default Board;
