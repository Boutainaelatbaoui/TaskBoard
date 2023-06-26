import { Paper } from "@mui/material";
import Title from "./Title";
import Card from "../Card/Card";
import AddCard from "../Card/AddCard";
import { useEffect, useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import CircleIcon from '@mui/icons-material/Circle';

const List = ({
  list,
  boardLists,
  setBoardLists,
  index,
  searched,
  compStartDate,
  compEndDate,
  invitedMembers,
  setInvitedMembers
}) => {
  
  const paperStyle = {
    borderRadius: 3,
    width: "295px",
    backgroundColor: "#ececec",
    marginTop: 0,
    marginBottom: 3,
    paddingBottom: 3,
    marginLeft: 2,
    flexShrink: 0,
  };
  
  const [toggleAddCard, setToggleAddCard] = useState(false);
  const [listTitle, setListTitle] = useState(list.name);
  const [currentList, setCurrentList] = useState(list);
  
  useEffect(() => {
    setCurrentList(list);
  }, [boardLists]);

  // console.log(list);
  
  return (
    <Draggable draggableId={currentList._id} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <Paper sx={paperStyle} {...provided.dragHandleProps}x>
            
            <Title
              listTitle={listTitle}
              setListTitle={setListTitle}
              listId={currentList._id}
              boardLists={boardLists}
              setBoardLists={setBoardLists}
              boardId={list.board_id}
              cardCount={currentList.cards.length}
            />
            
            <Droppable
              droppableId={currentList._id}
              index={index}
              type="card"
            >
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {provided.placeholder}
                  <AddCard
                    toggleAddCard={toggleAddCard}
                    setToggleAddCard={setToggleAddCard}
                    list={currentList}
                    setList={setCurrentList}
                    boardLists={boardLists}
                    setBoardLists={setBoardLists}
                  />
                  {currentList.cards.map((card, index) => (
                      ((card.name.toLowerCase().includes(searched.search.toLowerCase()) || (card.label && card.label.title.toLowerCase().includes(searched.search.toLowerCase()))) &&
                        (searched.members.length <= 0 ? true : (searched.members.includes(card.cardPermissions.map((per) => (per.user.name))[0]))) &&
                        (compStartDate(card, searched.dateRange[0]) && compEndDate(card, searched.dateRange[1]))
                      )
                    ) ? (
                      <Card visibility=''
                            key={card._id}
                            card={card}
                            index={index}
                            list={currentList}
                            setList={setCurrentList}
                            boardLists={boardLists}
                            setBoardLists={setBoardLists}
                            invitedMembers={invitedMembers}
                            setInvitedMembers={setInvitedMembers}
                      />
                    ) : (
                      <Card visibility='none'
                            key={card._id}
                            card={card}
                            index={index}
                            list={currentList}
                            setList={setCurrentList}
                            boardLists={boardLists}
                            setBoardLists={setBoardLists}
                            invitedMembers={invitedMembers}
                            setInvitedMembers={setInvitedMembers}
                      />
                    )
                  )}
  
                </div>
              )}
            </Droppable>
          </Paper>
        </div>
      )}
    </Draggable>
  );
};

export default List;
