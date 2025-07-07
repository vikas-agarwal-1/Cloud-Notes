import express from "express";
import { addNote, editNote, getAllNotes, deleteNote, updateNotePinned, searchNote } from "../controllers/noteController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/addNote", verifyToken, addNote);
router.put("/editNote/:id", verifyToken, editNote);
router.get("/getNote", verifyToken, getAllNotes);
router.delete("/delete/:id", verifyToken, deleteNote);
router.put("/update-note-pinned/:id", verifyToken, updateNotePinned);
router.get("/search", verifyToken, searchNote);

export default router;