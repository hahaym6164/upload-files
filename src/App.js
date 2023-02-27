import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const App = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [custodian, setCustodian] = useState("");
  const [progress, setProgress] = useState({});
  const onDrop = (file) => {
    const newFile = new File(
      [file[0]],
      prompt("Custodian Name", file[0].name),
      {
        type: file[0].type,
      }
    );
    let dup = files.find((i) => i.name == newFile.name);
    let dup2 = uploadedFiles.find((i) => i.name == newFile.name);
    if (dup || dup2) {
      alert("Duplicate name found, please use another name");
      return;
    }
    console.log(dup, dup2, "dup");
    let arr = files;
    arr.push(newFile);
    console.log(newFile, arr);
    setFiles(arr);
  };

  const handleClick = () => {
    if (files.length == 0) {
      alert("no files found");
      return;
    }
    setUploadedFiles(uploadedFiles.concat(files));
    setFiles([]);
    console.log("click");
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const initialProgress = uploadedFiles.reduce((acc, file) => {
        console.log(acc, file, "ac f");
        if (progress[file.name] >= 0) {
          acc[file.name] = 100;
        } else {
          acc[file.name] = 0;
        }
        return acc;
      }, {});
      setProgress(initialProgress);
      console.log(initialProgress, "initialProgress");
    }
  }, [uploadedFiles]);

  useEffect(() => {
    Object.entries(progress).forEach(([key, value]) => {
      if (value < 100) {
        const timer = setInterval(() => {
          setProgress((prevProgress) => {
            const updatedProgress = { ...prevProgress };

            if (updatedProgress[key] >= 100) {
              clearInterval(timer);
            } else {
              updatedProgress[key] += 10;
            }
            return updatedProgress;
          });
        }, 300);
        return () => clearInterval(timer);
      }
    });
  }, [progress]);

  // useEffect(() => {
  //   console.log("he");
  //   if (uploadedFiles.length > 0) {
  //     console.log("click inter");

  //     let nameList = [];
  //     uploadedFiles.map((item) => {
  //       nameList.push(item.name);
  //       let batch = {
  //         ...progress,
  //         [item.name]: 0,
  //       };
  //       setProgress(batch);
  //       console.log(batch, item.name);
  //     });
  //   }
  // }, [uploadedFiles]);
  // useEffect(() => {
  //   if (progress) {
  //     Object.keys(progress).map((key) => {
  //       if (progress[key] == 0) {
  //         const timer = setInterval(() => {
  //           let obj = progress;

  //           obj[key] += 10;

  //           setProgress(obj);
  //           console.log(progress, "useeff");
  //           if (obj[key] == 100) {
  //             clearInterval(timer);
  //           }
  //         }, 200);

  //         // return () => {
  //         //   clearInterval(timer);
  //         // };
  //       }
  //     });
  //   }
  // }, [progress]);
  return (
    <div className="drop-zone">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <h1>Files: </h1>
      <ul className="file-list">
        {uploadedFiles.map((f, i) => (
          <li key={i}>
            <p>{f.name}</p>{" "}
            <CircularProgress variant="determinate" value={progress[f.name]} />
          </li>
        ))}
      </ul>
      <ul className="file-list">
        {files.map((f, i) => (
          <li key={i}>
            <p>{f.name}</p>{" "}
          </li>
        ))}
      </ul>
      <Button variant="contained" onClick={handleClick}>
        Submit Files
      </Button>
      {/* <Box sx={{ display: "flex" }}> */}

      {/* </Box> */}
    </div>
  );
};

export default App;
