import React, { useState, useEffect } from "react";

// import { size, map } from "lodash";
import { User } from "../../../../api";
import { useAuth } from "../../../../hooks";

import Loader from "../../../ComponentesHome/Loader";

const userController = new User();

export function ListUsers(props) {
  const { usersActive, reload } = props;
  const [users, setUsers] = useState(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        setUsers(null);

        const response = await userController.getUsers(
          accessToken,
          usersActive
        );
        setUsers(response);
      } catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersActive, reload]);

  if (!users) return <Loader active inline="centered" />;
  // if (size(users) === 0) return "No hay ningun usuario";

  // return map(users, (user) => (
  //   <UserItem key={user._id} user={user} onReload={onReload} />
  // ));
}
