import React from "react";
import { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [taginput, setTagInput] = useState("");

  const addNewTag = ()=> {
    const newtag = taginput.trim();
    if (!tags.includes(newtag)) {
      setTags([...tags, newtag]);
    }
    setTagInput("");
  }

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && taginput.trim() !== "") {
      e.preventDefault();
      addNewTag();
    }
  };

  const handleRemoveTag = (removetag) => {
    setTags(tags.filter((tag) => tag !== removetag));
  };

  return (
      // <div>
      // <div/>
        <div>
          <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, indx) => (
              <span key = {indx} className={"flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded"}>#{tag}
                <button onClick={() => handleRemoveTag(tag)}>
                <MdClose />
              </button>
              </span>
          ))}
          </div>

            <div className="flex items-center gap-4 mt-3">
            <input className="text-sm bg-transparent border px-3 py-2 rounded outline-none" type="text" placeholder="enter tag" value={taginput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleKeyDown}/>

            <button className="w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700" onClick={()=>addNewTag()}> 
            <MdAdd className="text-2xl text-blue-700 hover:text-white"/>
            </button>

            </div>

        </div>
  );
};

export default TagInput;
