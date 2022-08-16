exports.reducer = (state, action) => {
  if (action.type === "name") {
    return {
      ...state,
      name: action.payload,
      error: "",
      success: "",
    };
  }
  if (action.type === "registering") {
    return {
      ...state,
      buttonText: "Registering",
    };
  }
  if (action.type === "email") {
    return {
      ...state,
      email: action.payload,
      error: "",
      success: "",
    };
  }
  if (action.type === "password") {
    return {
      ...state,
      password: action.payload,
      error: "",
      success: "",
    };
  }
  if (action.type === "reset") {
    return {
      name: "",
      email: "",
      error: "",
      password: "",
      buttonText: "Submitted",
      success: action.payload,
    };
  }
  if (action.type === "error") {
    return {
      name: "",
      email: "",
      password: "",
      buttonText: "Register",
      success: "",
      error: action.payload,
    };
  }
  return {
    ...state,
  };
};
