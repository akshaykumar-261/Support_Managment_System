import { maxLength } from "zod";

export const textFieldStyles = {
  width: "100%",
};
export const centerFlex = {
  // backgroundColor: "blue",
  justifyContent: "center",
  alignItems: "center",
};
export const boxProperites = {
  //  backgroundColor: "yellow",
  // height: "500px",
   //width: "500px",
  padding: "30px",
  borderRadius: 3,
  boxShadow: 20,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow:"hidden"
};
export const rightPannel = {
  backgroundColor: "orange",
  overflow: "hidden",
};
export const imageProperites = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
export const buttonProperties = {
  borderRadius: 2,
  backgroundColor: "#6D28D9",

  "&:hover": {
    backgroundColor: "#5d38ea",
  },
};
