import Note from "../models/noteModel.js";

export const addNote = async (req, res) => {
  const { title, content, tags } = req.body;

  const { id } = req.user;

  if (!title || !content) {
    return res.status(400).json({ message: "title and content are required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: id,
    });

    await note.save();

    res.status(201).json({success: true, message: "Note add Successfully",note});

  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Cannot add Note" });
  }
};


// export const editNote = async(req, res)=> {
//     try {
//         const { id } = req.params;
//         const updateNote = await Note.findByIdAndUpdate(id, req.body, {
//             new: true,
//         });
//         console.log(updateNote);
//         if (!updateNote) {
//             return res.status(404).json({ message: 'Note not found. Cannot update.' });
//         }
//         res.status(201).json({message:"Note Update Successfully",updateNote});
//     }

//     catch(err) {
//         console.error(err);
//         res.status(500).json({ message: "Error updating note" });
//     }
// }


// First MEthod
// export const editNote = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     // Step 1: Find note and check ownership
//     const note = await Note.findOne({ _id: id, userId });

//     if (!note) {
//       return res.status(404).json({ message: "Note not found or unauthorized" });
//     }

//     // Step 2: Update fields
//     const { title, content, tags, isPinned } = req.body;
//     if (title) note.title = title;
//     if (content) note.content = content;
//     if (tags) note.tags = tags;
//     if (typeof isPinned === "boolean") note.isPinned = isPinned;

//     await note.save();

//     res.status(200).json({
//       message: "Note updated successfully",
//       note,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error updating note" });
//   }
// };


// Second Method
export const editNote = async (req, res) => {
  try {
    const {id}  = req.params;
    const userId = req.user.id;

    // Step 1: Find note and check ownership
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if(note.userId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to edit this note" });
    }

    // Step 2: Update fields
    const { title, content, tags, isPinned } = req.body;
    if(!title && !content && !tags){
      return res.status(400).json({message:"No CHanges Provided"});
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    // if (typeof isPinned === "boolean") note.isPinned = isPinned;

    await note.save();

    res.status(200).json({
      message: "Note updated successfully",
      note,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating note" });
  }
};

export const getAllNotes = async(req, res)=> {
    try {
      const notes = await Note.find({userId: req.user.id}).sort({isPinned: -1});
      res.status(200).json({message:"Note found Successfully",count:notes.length, notes});
    }
    catch(err) {
      console.log(err);
      res.status(400).json({message:"Error in finding notes"});
    }
}


export const deleteNote = async(req, res)=> {
  const {id} = req.params;

  const note = await Note.findOne({_id: id, userId: req.user.id})

  if(!note) {
    return res.status(401).json({message: "Note not found or unauthorized"});
  }

  try {
    await Note.deleteOne({_id: note})
    res.status(200).json({message:"Note deleted successfully"});
  }
  catch(err) {
    console.log(err);
    res.status(500).json({message:"Error in deleting note"});
  }
}


export const updateNotePinned = async(req, res)=> {
  try {
    const note = await Note.findById(req.params.id)

    if(!note) {
      return res.status(400).json({message:"Note not Found"});
    }

    if(req.user.id !== note.userId) {
      return res.status(400).json({message:"Your are not authorized to update this note"});
    }

    const {isPinned} = req.body; 
    note.isPinned = isPinned;

    await note.save();
    res.status(200).json({message:"isPinned update successfully",note});

  }
  catch(err) {

  }
}



export const searchNote = async(req, res,)=> {
  const {query} = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const notes = await Note.find({
      userId: req.user.id,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({ message: "Search completed", count: notes.length, notes });
  }
  catch(err) {
    console.error("Search error", err);
    res.status(500).json({ message: "Failed to search notes" });
  }
}