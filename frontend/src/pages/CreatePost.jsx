import sanitizeHtml from "sanitize-html";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ImCross } from "react-icons/im";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const sanitizeInput = (value) => {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descError, setDescError] = useState("");
  const { user } = useContext(UserContext);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const navigate = useNavigate();

  const deleteCategory = (i) => {
    const updatedCats = [...cats];
    updatedCats.splice(i, 1);
    setCats(updatedCats);
  };

  const addCategory = () => {
    if (cat.trim() !== "") {
      setCats([...cats, cat]);
      setCat("");
    }
  };

  const validateFileType = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg"];
    return allowedTypes.includes(file.type);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    setFileError("");
    setTitleError("");
    setDescError("");

    const sanitizedTitle = sanitizeInput(title);
    const sanitizedDesc = sanitizeInput(desc);
    const sanitizedCategories = cats.map(sanitizeInput);

    if (sanitizedTitle.length > 40) {
      setTitleError("Title must not exceed 40 characters!");
      return;
    }

    if (sanitizedDesc.length > 500) {
      setDescError("Description must not exceed 500 characters!");
      return;
    }

    if (file && (file.size > 5 * 1024 * 1024 || !validateFileType(file))) {
      setFileError("Only .jpg and .jpeg files under 5MB are allowed!");
      return;
    }

    const post = {
      title: sanitizedTitle,
      desc: sanitizedDesc,
      username: user.username,
      userId: user._id,
      categories: sanitizedCategories,
    };

    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("img", filename);
      data.append("file", file);
      post.photo = filename;

      try {
        await axios.post(URL + "/api/upload", data);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      const res = await axios.post(URL + "/api/posts/create", post, {
        withCredentials: true,
      });
      navigate("/posts/post/" + res.data._id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="px-6 md:px-[200px] mt-8">
        <h1 className="font-bold md:text-2xl text-xl">Create a post</h1>
        <form className="w-full flex flex-col space-y-4 md:space-y-8 mt-4">
          <input
            value={title}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 40) {
                setTitle(value);
                setTitleError(""); // Clear error if within limit
              } else {
                setTitleError("Title must not exceed 40 characters!");
              }
            }}
            type="text"
            placeholder="Enter post title"
            className="px-4 py-2 outline-none"
          />
          {titleError && <p className="text-red-500">{titleError}</p>}

          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            className="px-4"
          />
          {fileError && <p className="text-red-500">{fileError}</p>}

          <input
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            placeholder="Enter post category"
            className="px-4 py-2 outline-none"
            type="text"
          />
          <div
            onClick={addCategory}
            className="bg-black text-white px-4 py-2 font-semibold cursor-pointer w-[30%] md:w-[10%] text-center mx-auto"
          >
            Add
          </div>

          {/* Display the list of added categories */}
          <div className="flex flex-wrap gap-2 mt-2">
            {cats.map((category, index) => (
              <div
                key={index}
                className="bg-gray-200 text-black px-3 py-1 rounded flex items-center space-x-2"
              >
                <span>{category}</span>
                <ImCross
                  className="text-red-500 cursor-pointer"
                  onClick={() => deleteCategory(index)}
                />
              </div>
            ))}
          </div>

          <textarea
            value={desc}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 500) {
                setDesc(value);
                setDescError(""); // Clear error if within limit
              } else {
                setDescError("Description must not exceed 500 characters!");
              }
            }}
            rows={10}
            placeholder="Enter post description"
            className="px-4 py-2 outline-none"
          />
          {descError && <p className="text-red-500">{descError}</p>}

          <button
            onClick={handleCreate}
            className="bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg"
          >
            Create
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePost;
