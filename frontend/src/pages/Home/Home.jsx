import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { MdAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard.jsx";
import Modal from "react-modal";
import AddEditNotes from "./AddEditNotes.jsx";
import axios from "../../utils/axiosInstance";

const Home = () => {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

// useEffect(() => {
  const fetchNotes = async () => {
    try {
      const response = await axios.get("/getNote",{
        withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
      });
      console.log(response)
      setNotes(response.data.notes);
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  };

  const searchNotes = async () => {
    try {
      const res = await axios.get(`/search?query=${searchQuery}`, {
        withCredentials: true,
      });
      setNotes(res.data.notes);
    } catch (err) {
      console.error("Error searching notes", err);
    }
  };

  // useEffect(()=> {
  //   fetchNotes();
  // }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchNotes();
    } else {
      fetchNotes();
    }
  }, [searchQuery]);
  
// }, []);


const handleEditNote = (note) => {
  setOpenAddEditModel({ isShown: true, type: "edit", data: note });
};

const handleDeleteNote = async (id) => {
  try {
    await axios.delete(`/delete/${id}`);
    setNotes(notes.filter((note) => note._id !== id));
  } catch (err) {
    console.error("Failed to delete note", err);
  }
};

const handlePinNote = async (note) => {
  try {
    const res = await axios.put(`/update-note-pinned/${note._id}`, {
      isPinned: !note.isPinned,
    });
    setNotes((prev) =>
      prev.map((n) => (n._id === note._id ? res.data.note : n))
    );
  } catch (err) {
    console.error("Failed to pin/unpin note", err);
  }
};


  return (
    <>
     <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 max-md:m-5">
          {notes.map((note)=>(
            <NoteCard
            title={note.title}
            date={new Date(note.createdAt).toLocaleDateString()}
            content={note.content}
            tags={note.tags.join(", ")}
            isPinned={note.isPinned}
            onEdit={() => handleEditNote(note)}
            onDelete={() => handleDeleteNote(note._id)}
            onPinNote={() => handlePinNote(note)}
          />
          ))}
          
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#2b85FF] hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModel({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => setOpenAddEditModel({ isShown: false, type: "add", data: null })}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-wd:w-[60%] max-sm:w-[70%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          onClose={() =>{
            setOpenAddEditModel({ isShown: false, type: "add", data: null });
            fetchNotes();
          }}
          noteData={openAddEditModel.data}
          type={openAddEditModel.type}
        />
      </Modal>
    </>
  );
};

export default Home;
