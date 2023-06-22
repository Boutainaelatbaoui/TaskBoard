import { useEffect, useState } from "react";
import { Button, Paper, Table, TableBody } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import BoardSearch from "../../components/Board/BoardSearch";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import BoardForm from "../../components/Board/BoardForm";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import AssessmentIcon from '@mui/icons-material/Assessment';
import BoardStats from "../../components/Board/BoardStats";
import GroupForm from "../../components/Group/GroupForm";
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Swal from 'sweetalert2';
import { avatarColors } from '../../data/avatarColors';
import GroupsIcon from '@mui/icons-material/Groups';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';

const Boards = () => {
  const [recordBoardUpdate, setRecordBoardUpdate] = useState("");
  const [recordUpdate, setRecordUpdate] = useState("");
  const [boards, setBoards] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searched, setSearched] = useState("");
  const [openBoardPopup, setOpenBoardPopup] = useState(false);
  const [openStatsPopup, setOpenStatsPopup] = useState(false);
  const [openGroupForm, setOpenGroupForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBoard, setSelectedBoard] = useState({});
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const GetBoards = async () => {
    if (!user) return;
    const token = user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    
    try {
      const response = await axios.get("http://localhost:3001/board/", config);
      const { status, message, data } = response;
      if (status !== 200) {
        alert(message, status);
      } else {
        setBoards(data);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const GetGroups = async () => {
    if (!user) return;
    const token = user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    
    try {
      const response = await axios.get("http://localhost:3001/group/", config);
      const { status, message, data } = response;
      if (status !== 200) {
        alert(message, status);
      } else {
        setGroups(data);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  
  useEffect(() => {
    GetBoards();
    GetGroups();
    setIsLoading(false);
    console.log('board');
  }, [openBoardPopup]);
  
  //delete Board
  const deleteBoards = async (id) => {
    if (!user) return;
    const token = user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.patch(`http://localhost:3001/board/${id}`, { active: false }, config);
          if (response.status === 200) {
            Swal.fire(
              'Deleted!',
              'Your group has been deleted.',
              'success'
            );
            console.log("Board deleted successfully");
            GetBoards();
          }
        } catch (err) {
          Swal.fire("Error", "You don't have admin access!", "error");
          console.log("error", err);
        }
      }
    });
  };

// delete Group
const deleteGroups = async (id) => {
  if (!user) return;
  const token = user.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3001/group/${id}`,
          config
        );
        if (response.status === 200) {
          Swal.fire(
            'Deleted!',
            'Your group has been deleted.',
            'success'
          );
          console.log("Group deleted successfully");
          GetGroups();
        }
      } catch (err) {
        Swal.fire("Error", "You don't have admin access!", "error");
        console.log("error", err);
      }
    }
  });
};
  
  // Styling
  const styles = {
    paperStyle: {
      width: "90%",
      margin: '10px auto',
      marginTop: 15,
      padding: 8,
    },
    tableStyle: {
      minWidth: 600,
      "& thead th": {
        fontWeight: 600,
        backgroundColor: "#e3e3f3",
        color: "#333996",
      },
      "& tbody tr:hover": {
        backgroundColor: "#fafafa",
        cursor: "pointer",
      },
      "& tbody td": {
        fontWeight: 300,
      },
    },
    buttons: {
      addBoard: {
        backgroundColor: "#333996",
        // margin: 'auto',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
      },
      addGroup: {
        backgroundColor: "#023e8a",
        // margin: 'auto',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
      },
      edit: {
        color: "#ffffff",
        backgroundColor: "#ED6C02",
        "&:hover": {
          backgroundColor: "#faa864",
        },
      },
      delete: {
        color: "#ffffff",
        backgroundColor: "#D32F2F",
        "&:hover": {
          backgroundColor: "#f75252",
        },
      },
    },
  };
  //----------------------------------------------------------------Styling
  
  const openInPopup = () => {
    setRecordBoardUpdate();
    setOpenBoardPopup(!openBoardPopup);
  };

  const openUpdatePopup = (item) => {
    setRecordBoardUpdate(item);
    setOpenBoardPopup(!openBoardPopup);
  };

  const openEditPopup = (item) => {
    setRecordUpdate(item);
    setOpenGroupForm(!openGroupForm)
  };

  const openGroupPopup = () => {
    setRecordUpdate();
    setOpenGroupForm(!openGroupForm)
  };
  
  
  const handleOnClickRow = (id) => {
    navigate(`/taskboard/${id}`);
  };
  
  if (isLoading) {
    return <Spinner/>
  }
  
  const onBoardStatsClicked = (boardId) => {
    setSelectedBoard(boards[boardId]);
    setOpenStatsPopup(true);
  }
  
  return (
    <>
      <Paper sx={styles.paperStyle} elevation={2}>
        <div
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 50
            }
          }
        >
          <BoardSearch searched={searched} setSearched={setSearched}/>
          <div>
            <Button
              style={styles.buttons.addBoard}
              variant="contained"
              children="New Boards"
              onClick={() => openInPopup()}
              startIcon={<AddIcon />}
            />
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '25px', color: '#274c77'}}>
          <div style={{display: 'flex', gap: '15px', marginBottom: '25px'}}>
            <PeopleAltIcon fontSize="large" />
            <Typography variant="h5" gutterBottom>
              MY TEAMS
            </Typography>
          </div>
          <div>
            <Button
              style={styles.buttons.addGroup}
              variant="contained"
              children="Add Team"
              onClick={() => openGroupPopup()}
              startIcon={<AddIcon />}
            />
          </div>
        </div>
        <TableContainer component={Paper} style={{marginBottom: '55px'}}>
          <Table sx={styles.tableStyle} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell>Teams Name</TableCell>
                <TableCell align="center">Teams Description</TableCell>
                <TableCell align="center">Add Members</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.length <= 0 ? (<><TableRow><TableCell>No teams available</TableCell></TableRow></>) : groups
                .filter(
                  (group) =>
                    group.name.toLowerCase().includes(searched.toLowerCase()) ||
                    group.description
                      .toLowerCase()
                      .includes(searched.toLowerCase())
                )
                .map((group, index) => (
                  <TableRow
                    key={group._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <Link to={`/group/${group._id}`} style={{textDecoration: 'none', color: 'black'}}>
                      <TableCell component="th" scope="row">
                        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                            <Avatar style={{ backgroundColor: avatarColors[group.color], color: '#FFFFFF'}}>
                                <GroupsIcon />
                            </Avatar>
                          <div>{group.name}</div>
                        </div>
                      </TableCell>
                    </Link>
                    <TableCell
                      align="center"                      
                    >
                      {group.description}
                    </TableCell>
                    <TableCell align="center">
                      <Link to={`/group/${group._id}`}>
                      <Button
                        style={styles.buttons.addGroup}
                        variant="contained"
                        children="Add Member"
                        startIcon={<AddIcon />}
                      />
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="warning"
                        sx={{ marginLeft: 2 }}
                        onClick={() => openEditPopup(group)}
                      >
                        <ModeEditOutlineIcon/>
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => deleteGroups(group._id)}
                        sx={{ marginLeft: 2 }}
                      >
                        <DeleteForeverIcon/>
                      </Button>
                      {user.role.toLowerCase() === 'admin' && (
                        <Button
                          variant="outlined"
                          color="info"
                          onClick={() => onBoardStatsClicked(index)}
                          sx={{ marginLeft: 2 }}
                        >
                          <AssessmentIcon/>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{display: 'flex', gap: '15px', marginBottom: '25px', color: '#274c77'}}>
          <DashboardIcon fontSize="large" />
          <Typography variant="h5" gutterBottom>
            MY BOARDS
          </Typography>
        </div>
        <TableContainer component={Paper}>
          <Table sx={styles.tableStyle} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell>Boards Name</TableCell>
                <TableCell align="center">Boards Description</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boards.length <= 0 ? (<><TableRow><TableCell>No boards available</TableCell></TableRow></>) : boards
                .filter(
                  (board) =>
                    board.name.toLowerCase().includes(searched.toLowerCase()) ||
                    board.descData
                      .toLowerCase()
                      .includes(searched.toLowerCase())
                )
                .map((board, index) => (
                  <TableRow
                    key={board._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <Link to={`/taskboard/${board._id}`} style={{textDecoration: 'none', color: 'black'}}>
                      <TableCell component="th" scope="row">
                          {board.name}
                      </TableCell>
                    </Link>
                    <TableCell
                      onClick={() => handleOnClickRow(board._id)}
                      align="center"
                      
                    >
                      {board.descData}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => handleOnClickRow(board._id)}
                      >
                        <MenuIcon/>
                      </Button>
                      <Button
                        variant="outlined"
                        color="warning"
                        sx={{ marginLeft: 2 }}
                        onClick={() => openUpdatePopup(board)}
                      >
                        <ModeEditOutlineIcon/>
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => deleteBoards(board._id)}
                        sx={{ marginLeft: 2 }}
                      >
                        <DeleteForeverIcon/>
                      </Button>
                      {user.role.toLowerCase() === 'admin' && (
                        <Button
                          variant="outlined"
                          color="info"
                          onClick={() => onBoardStatsClicked(index)}
                          sx={{ marginLeft: 2 }}
                        >
                          <AssessmentIcon/>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Popup
        openPopup={openBoardPopup}
        setOpenPopup={setOpenBoardPopup}
        setRecordUpdate={setRecordBoardUpdate}
        recordUpdate={recordBoardUpdate}
        title={recordBoardUpdate ? "Update Board" : "New board"}
      >
        <BoardForm
          openPopup={openBoardPopup}
          setOpenPopup={setOpenBoardPopup}
          recordUpdate={recordBoardUpdate}
        />
      </Popup>
      <Popup
        openPopup={openGroupForm}
        setOpenPopup={setOpenGroupForm}
        setRecordUpdate={setRecordUpdate}
        recordUpdate={recordUpdate}
        title={recordUpdate ? "Update Group" : "New Group"}
      >
        <GroupForm
          openPopup={openGroupForm}
          setOpenPopup={setOpenGroupForm}
          recordUpdate={recordUpdate}
          getGroups={GetGroups} // Pass the GetGroups function as a prop
        />
      </Popup>
      
      {/*charts popup*/}
      <Popup
        openPopup={openStatsPopup}
        setOpenPopup={setOpenStatsPopup}
        title="board statistics"
      >
        <BoardStats
          openPopup={openStatsPopup}
          setOpenPopup={setOpenStatsPopup}
          board={selectedBoard}
          GetGroups= {GetGroups()}
        />
      </Popup>
    </>
  );
};

export default Boards;
