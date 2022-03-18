import React, { useContext, Fragment } from "react";

import { Link } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";
import LoginForm from "../user/LoginForm";
import { GetCookie } from "../../app/common/util/util";

const HomePage = () => {
  // const token = window.localStorage.getItem("limstoken");
  const token = GetCookie("bstoken");
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.userStore;
  /*const { openModal } = rootStore.modalStore;*/
  return (
  null
  );
};

export default HomePage;
