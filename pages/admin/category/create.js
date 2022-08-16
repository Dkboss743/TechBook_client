import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../config";
import Resizer from "react-image-file-resizer";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import dynamic from "next/dynamic";
import Layout from "../../../components/Layout";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.bubble.css";

import withAdmin from "../../withAdmin";
import FormData from "form-data";
const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: "",
    error: "",
    success: "",
    buttonText: "Create",
    // imageUploadText: "Upload image",
    image: "",
  });
  const [imageUploadButtonName, setImageUploadButtonName] =
    useState("Upload Image");
  const [content, setContent] = useState("");
  const { name, buttonText, image, success, error } = state;
  const handleContent = (e) => {
    setContent(e);
    setState({
      ...state,
      success: "",
      error: "",
    });
  };
  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
    });
  };
  const handleImage = (e) => {
    let fileInput = false;
    if (e.target.files) {
      fileInput = true;
    }
    if (fileInput) {
      Resizer.imageFileResizer(
        e.target.files[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          setState({
            ...state,
            image: uri,
            success: "",
            error: "",
          });
          setImageUploadButtonName(e.target.files[0].name);
        },
        "base64"
      );
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({
      ...state,
      buttonText: "Creating",
    });
    try {
      const response = await axios.post(
        `${API}/category`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("CATEGORY CREATE RESPONSE", response);
      setState({
        ...state,
        name: "",
        buttonText: "Created",
        success: `${response.data.name} is created`,
      });
    } catch (error) {
      console.log("CATEGORY CREATE ERROR", error);
      setState({
        ...state,
        name: "",
        buttonText: "Create",
        error: "",
      });
    }
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
          required
        ></input>
      </div>
      <div className="form-group">
        <label className="text-muted">Content</label>
        <ReactQuill
          onChange={handleContent}
          placeholder="Write something..."
          value={content}
          theme="bubble"
          className="pb-5 mb-3"
          style={{ border: "1px solid #666" }}
        ></ReactQuill>
      </div>
      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadButtonName}
          <input
            onChange={handleImage}
            type="file"
            accept="image/*"
            className="form-control"
            required
            hidden
          ></input>
        </label>
      </div>
      <div>
        <button className="btn btn-outline-warning">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Create category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {createCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withAdmin(Create);
