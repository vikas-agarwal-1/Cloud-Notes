import React from "react";
import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import TagInput from "../../components/Input/TagInput";
import toast from "react-hot-toast";
import axios from "../../utils/axiosInstance";

const AddEditNotes = ({ onClose, noteData, type, fetchNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (type === "edit" && noteData) {
      setTitle(noteData.title);
      setContent(noteData.content);
      setTags(noteData.tags);
    }
  }, [noteData, type]);

  const editNote = async () => {
    try {
      const response = await axios.put(`/editNote/${noteData._id}`, {
        title,
        content,
        tags,
      },
          {
            withCredentials: true,
          }
      );
      toast.success("Note updated successfully");
      fetchNotes();
      onClose();
      console.log(response);
      onClose(); // close modal
    } catch (err) {
      console.log(err);
      toast.error("Failed to edit note");
    }
  };

  // const addNewNote = async () => {
  //   try {
  //     const response = await axiosInstance.post("/note/addNote", {
  //       title,
  //       content,
  //       tags,
  //     });
  //     console.log("Note Added:", response.data);
  //     onClose();
  //   } catch (error) {
  //     console.error("Error adding note:", error);
  //     setError("Failed to add note");
  //   }
  // };

  const addNewNote = async () => {
    try {
      const response = await axios.post(
        "/addNote", 
        { title, content, tags },
        { withCredentials: true } 
      );
      console.log(response);
      toast.success("Note added successfully");
      onClose(); // Close modal after adding
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add note");
    }
  };

  const handleAddNote = ()=> {
    if(!title) {
        setError("Please enter title")
        return
    }
    if(!content) {
        setError("Please enter content")
        return
    }

    setError("")

    if(type === 'edit') {
        editNote()
    }
    else {
        addNewNote()
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:ng-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2 ">
        <label className="input-label text-red-400 uppercase">Title</label>

        <input
          type="text"
          className="text-2xl text-slate-950 outline-none "
          placeholder="Wake up at 6 am"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label text-red-400 uppercase">Content</label>

        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content..."
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        >
          {" "}
        </textarea>
      </div>

    <div className="mt-3 ">
        <label className="input-label text-red-400 uppercase">tags</label>
        <TagInput tags={tags} setTags={setTags}/>

    </div>

    {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

        <button className="btn-primary font-medium mt-5 p-3" onClick={handleAddNote}>{type === "edit" ? "UPDATE" : "ADD"}</button>

    </div>
  );
};

export default AddEditNotes;
