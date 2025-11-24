import {  useRef } from "react";
import axios from "axios";
import { uploadPic } from "../Servieces/Service";

export default function Profile({ id, onUploaded }) {
//   const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    e.stopPropagation(); 

    const file = e.target.files[0];
    if (!file) return;

    // setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", id);
     
    const res = await axios.post(
      "http://localhost:3000/api/updateProfilePic",
      formData
    );
            
    console.log(res);
    

    
    if (onUploaded) onUploaded();
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {/* {preview && (
        <img src={preview} alt="" className="w-32 h-32 rounded-full mb-3" />
      )} */}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={(e) => {
          e.stopPropagation();     
          fileInputRef.current.click();
        }}
      >
        Choose Picture
      </button>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onClick={(e) => e.stopPropagation()}   // VERY IMPORTANT
        onChange={handleFileChange}
      />
    </div>
  );
}
