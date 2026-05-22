export const textFieldStyles = {
  width: "100%",

  "& .MuiOutlinedInput-root": {
    /* Default Border */
    "& fieldset": {
      borderColor: "#ccc",
    },

    /* Hover Border - !important lagaya taaki MUI ka black color hat jaye */
    "&:hover fieldset": {
      borderColor: "#6D28D9 !important",
    },

    /* Focus Border - Isko thoda aur specific kiya taaki blue ya koi aur color na aaye */
    "&.Mui-focused fieldset": {
      borderColor: "#6D28D9 !important",
      borderWidth: "2px",
    },

    /* Input Text Color aur Cursor */
    "& input": {
      color: "#000",
      caretColor: "#6D28D9", 
    },
  },

  /* Label Default */
  "& .MuiInputLabel-root": {
    color: "#777",
  },

  /* Label Focus - !important lagaya taaki label ka color bhi lock ho jaye */
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#6D28D9 !important",
  },

  /* Text Selection Color */
  "& input::selection": {
    backgroundColor: "#6D28D9",
    color: "#fff",
  },
};
export const centerFlex = {
  // backgroundColor: "blue",
  justifyContent: "center",
  alignItems: "center",
};
export const boxProperites = {
  //  backgroundColor: "yellow",
  // height: "400px",
  // width: "400px",
  padding: "80px",

  borderRadius: 3,
  boxShadow: 20,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
export const rightPannel = {
  backgroundColor: "orange",
};
export const imageProperites = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
export const buttonProperties = {
  borderRadius: 2,
  backgroundColor: "#ad3891",

  "&:hover": {
    backgroundColor: "#922f79",
  },
};
