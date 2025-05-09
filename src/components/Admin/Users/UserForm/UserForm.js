import React, { useCallback } from "react";

import { useFormik } from "formik";
import { useDropzone } from "react-dropzone";
import { User } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { image } from "../../../../assets";
import { ENV } from "../../../../utils";
import { initialValues, validationSchema } from "./UserForm.form";
import "./UserForm.scss";
import { Form, Image } from "antd";

const userController = new User();

export function UserForm(props) {
  const { close, onReload, user } = props;
  const { accessToken } = useAuth();

  const formik = useFormik({
    initialValues: initialValues(user),
    validationSchema: validationSchema(user),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        if (!user) {
          await userController.createUser(accessToken, formValue);
        } else {
          await userController.updateUser(accessToken, user._id, formValue);
        }
        onReload();
        close();
      } catch (error) {
        console.error(error);
      }
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    formik.setFieldValue("avatar", URL.createObjectURL(file));
    formik.setFieldValue("fileAvatar", file);
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    onDrop,
  });

  const getAvatar = () => {
    if (formik.values.fileAvatar) {
      return formik.values.avatar;
    } else if (formik.values.avatar) {
      return `${ENV.BASE_PATH}/${formik.values.avatar}`;
    }
    return image.noAvatar;
  };

  return (
    <Form className="user-form" onSubmit={formik.handleSubmit}>
      <div className="user-form__avatar" {...getRootProps()}>
        <input {...getInputProps()} />
        <Image avatar size="small" src={getAvatar()} />
      </div>

      <Form.Group widths="equal">
        <Form.Input
          name="displayName"
          placeholder="Nombre y apellido"
          onChange={formik.handleChange}
          value={formik.values.displayName}
          error={formik.errors.displayName}
        />
      </Form.Group>

      <Form.Group widths="equal">
        <Form.Input
          name="email"
          placeholder="Correo electronico"
          onChange={formik.handleChange}
          value={formik.values.email}
          error={formik.errors.email}
        />
        {/* <Form.Dropdown
          placeholder="Seleccióna un rol"
          options={roleOptions}
          selection
          onChange={(_, data) => formik.setFieldValue("role", data.value)}
          value={formik.values.role}
          error={formik.errors.role}
        /> */}
      </Form.Group>

      <Form.Input
        type="password"
        name="password"
        placeholder="Contraseña"
        onChange={formik.handleChange}
        value={formik.values.password}
        error={formik.errors.password}
      />

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        {user ? "Actualizar usuario" : "Crear usuario"}
      </Form.Button>
    </Form>
  );
}
