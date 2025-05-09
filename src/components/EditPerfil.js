import React, { useState, useCallback, useEffect } from "react";
import { Button, TextField, Grid, Avatar } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { User } from "../api";
import { notification } from "antd";
import { createUploadFile } from "../api/uploadFiles.api";
import { validateEmail } from "../utils/utils";
import ButtonComponent from "./ButtonComponent";
import ChangePassword from "./ChangePassword";
import Modal from "./Modal";
import noImage from "../assets/no-avatar.png";
import { useMyReloadContext } from "../contexts/reloadRequest";

const userController = new User();

export default function EditPerfil(props) {
  const { setIsVisibleModal, onReload, user, reload } = props;
  const { toggleReload } = useMyReloadContext();

  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  const [formValues, setFormValues] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [isVisibleModalPassword, setIsVisibleModalPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormValues(user);
    }
  }, [user]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFormValues({
        ...formValues,
        avatar: URL.createObjectURL(file),
        fileAvatar: file,
      });
    },
    [formValues]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields({
      ...touchedFields,
      [name]: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = {};
    if (!formValues.displayName) errors.displayName = "Campo requerido";

    if (!formValues.email) errors.email = "Campo requerido";
    else if (!validateEmail(formValues.email))
      errors.email = "El correo electrónico no es válido";

    if (Object.keys(errors)?.length > 0) {
      // Show validation errors
      setIsSubmitting(false);
      notification.error({
        message: "Error",
        description: Object.values(errors).join(", "),
      });
      return;
    }

    try {
      if (formValues?.fileAvatar) {
        const result = await createUploadFile(formValues?.fileAvatar);

        if (result.state === "ok") {
          const urlData = result.url;

          formValues.avatar = urlData;
        }
      }

      const result = await userController.updateUser(user._id, formValues);
      if (result) {
        notification.success({
          message: "Usuario actualizado",
          description: `El usuario ${formValues.displayName} ha sido actualizado exitosamente.`,
        });
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      notification.error({
        message: "Error",
        description: error.message || "Error al procesar la solicitud",
      });
    } finally {
      onReload(!reload);
      setIsVisibleModal(false);
      setIsSubmitting(false);
      setTouchedFields({});
      toggleReload();
    }
  };

  const modifyPassword = () => {
    setIsVisibleModalPassword(true);
    setModalTitle("Modificar contraseña");
    setModalContent(
      <ChangePassword setVisibleModal={setIsVisibleModalPassword} user={user} />
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="user-form">
        <div style={{ justifyContent: "center", display: "flex" }}>
          <div
            className="user-form__avatar"
            style={{
              width: 110,
              height: 110,
              border: "2px dashed black",
              borderRadius: "100%",
              cursor: "pointer",
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <Avatar
              src={formValues?.avatar ? formValues.avatar : noImage}
              style={{ width: 100, height: 100, border: "2px dashed #ccc" }}
            />
          </div>
        </div>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              size="small"
              name="displayName"
              label="Nombre y apellido"
              required
              value={formValues?.displayName || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touchedFields?.displayName && !formValues?.displayName}
              helperText={
                touchedFields?.displayName && !formValues?.displayName
                  ? "Campo requerido"
                  : ""
              }
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              name="email"
              size="small"
              required
              label="Correo electrónico"
              value={formValues?.email || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                (touchedFields?.email && !formValues?.email) ||
                (formValues?.email && !validateEmail(formValues?.email))
              }
              helperText={
                (touchedFields?.email &&
                  !formValues?.email &&
                  "Campo requerido") ||
                (formValues?.email &&
                  !validateEmail(formValues?.email) &&
                  "Correo electrónico no válido")
              }
            />
          </Grid>

          {/* <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              name="address"
              label="Domicilio"
              value={formValues?.address || ""}
              onChange={handleChange}
            />
          </Grid> */}
          <Grid
            item
            xs={12}
            style={{ justifyContent: "flex-start", display: "flex" }}
          >
            <Button variant="outlined" color="primary" onClick={modifyPassword}>
              Cambiar contraseña
            </Button>
          </Grid>
          <Grid item xs={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <ButtonComponent
                disabled={isSubmitting}
                name={"Guardar"}
                toAction={handleSubmit}
              />
            </div>
          </Grid>
        </Grid>
      </form>

      <Modal
        title={modalTitle}
        open={isVisibleModalPassword}
        setIsVisible={setIsVisibleModalPassword}
      >
        {modalContent}
      </Modal>
    </>
  );
}
