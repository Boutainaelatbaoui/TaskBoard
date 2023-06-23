import { TextField, Grid, Button, Stack, Paper } from "@mui/material";
import { flexbox } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';

function BoardForm({ recordUpdate, openPopup, setOpenPopup }) {
  const [state, setState] = useState(recordUpdate ? recordUpdate : { name: "", descData: "" });
  const { name, descData } = state;
  const { user } = useSelector((state) => state.auth);
  
  const styles = {
    form: {
      display: flexbox,
    },
    container: {
      alignItems: "center",
      justifyContent: "center",
    },
    inputStyle: {
      width: "100%",
      "&:not(:last-child)": {
        marginBottom: 5,
      },
    },
    title: {
      fontSize: 25,
      marginBottom: 50,
    },
    submit: {
      textAlign: "center",
    },
    paper: {
      margin: "auto",
      paddingTop: 2,
      paddingBottom: 8,
      paddingLeft: 5,
      paddingRight: 5,
      width: "100%",
    },
  };
  
  useEffect(() => {
    if (state._id) {
      getSingleBoard(state._id);
    }
  }, []);
  
  if (!user) return;
  const token = user.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  
  //getSingleBoard
  const getSingleBoard = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/board/${state._id}`, config
      );
      setState(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  
  //addBoard
  const addBoard = async (data) => {
    try {
      const newBoard = await axios.post("http://localhost:3001/board/create", data, config);
      await axios.post(`http://localhost:3001/list/${newBoard.data._id}/create`, {
        name: 'Todo',
        board_id: newBoard.data._id
      });
      await axios.post(`http://localhost:3001/list/${newBoard.data._id}/create`, {
        name: 'Doing',
        board_id: newBoard.data._id
      });
      await axios.post(`http://localhost:3001/list/${newBoard.data._id}/create`, {
        name: 'Done',
        board_id: newBoard.data._id
      });
      Swal.fire("Success", "Board added successfully!", "success");
    } catch (err) {
      console.log(err);
    }
  };
  
  //updateBoard
  const updateBoard = (data) => {
    console.log('updateData', data);
  axios
    .patch(`http://localhost:3001/board/${state._id}`, { name: data.name, descData: data.descData }, config)
    .then((res) => {
      Swal.fire("Success", "Group updated successfully!", "success");
      console.log(res.data);
    })
    .catch((err) => {
      Swal.fire("Error", "You don't have admin access!", "error");
      console.log(err);
    });
  };
  
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!state._id) {
      addBoard(state);
    } else {
      updateBoard(state);
    }
    setOpenPopup(false);
  };
  
  const handleInputChange = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  
  return (
    <>
      <Paper elevation={0} sx={styles.paper}>
        <form onSubmit={handleOnSubmit}>
          <Grid container sx={styles.container}>
            <Grid item>
              <TextField
                variant="outlined"
                label="Boards Name"
                name="name"
                value={name}
                onChange={handleInputChange}
                sx={styles.inputStyle}
              />
              <TextField
                variant="outlined"
                label="Boards Description"
                name="descData"
                value={descData}
                onChange={handleInputChange}
                sx={styles.inputStyle}
              />
              <Stack spacing={2} direction="row">
                <Button
                  type="submit"
                  variant="contained"
                  children="Submit"
                  size="large"
                  sx={styles.submit}
                />
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
}

export default BoardForm;
