import Grid from "@mui/material/Grid";
//full page standard grid layout container
export const AppGridContainer = ({ children, sx, ...props }) => {
  return (
    <Grid sx={sx} {...props}>
      {children}
    </Grid>
  );
};
export const QuarterColumn = ({ children, sx, ...props }) => {
  return (
    <Grid container sx={sx} size={{ xs: 12, sm: 6, md: 3 }} {...props}>
      {children}
    </Grid>
  );
};
export const HalfColumn = ({ children, ...props }) => {
  return (
    <Grid size={{ xs: 12, md: 6 }} {...props}>
      {children}
    </Grid>
  );
};
