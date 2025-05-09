import React, { useState, useCallback } from "react";
import { Row, Col } from "antd";
import { useDropzone } from "react-dropzone";
import { v4 } from "uuid";
import "./UploadFile.css";
import DeleteIcon from "@mui/icons-material/Delete";
const UploadFile = (props) => {
  const { setFileSelected, fileSelectedext } = props;

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function Upload(props) {
    const { setFile, setIsLoading, fileSelected } = props;

    const onDrop = useCallback(
      (acceptedFiles) => {
        setIsLoading(true);
        const file = acceptedFiles[0];
        setFile({ file, preview: URL.createObjectURL(file) });
        // setLeadData({ ...leadData, avatar: file });
        // acceptedFiles.map(async (file) => {
        let object = {};
        let extSplit = file.name.split(".");
        let fileExt = extSplit[1];

        //   // const convertedFile = await convertToBase64(file);
        object = {
          id: v4(),
          documentName: file.name,
          type: file.type,
          fileExtension: fileExt,
          file: file,
          size: file.size,
        };

        //   filesArray.push(object);
        // });

        // setIsLoading(false);
        setFile(object);
        setFileSelected(object);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [setFile]
    );

    const { getRootProps, getInputProps } = useDropzone({
      noKeyboard: true,
      onDrop,
      maxFiles: 1,
    });

    return (
      <>
        <div className="" {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="insertFile">
            <span style={{ color: "#c3c3c3" }}>
              {fileSelected ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    * {fileSelected?.documentName} - {fileSelected?.size} bytes{" "}
                  </span>
                  <DeleteIcon
                    style={{ color: "red", marginLeft: "0.5rem" }}
                    onClick={() => setFile(null)}
                  />
                </div>
              ) : (
                "Arrastre y suelte la imagen"
              )}
            </span>
          </div>
        </div>
      </>
    );
  }

  return (
    <Row gutter={24}>
      <Col span={24}>
        <Upload
          file={file}
          setFile={setFile}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          fileSelected={fileSelectedext}
        />
      </Col>
    </Row>
  );
};
export default UploadFile;
