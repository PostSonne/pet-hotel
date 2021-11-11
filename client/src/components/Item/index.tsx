import {styled} from "@mui/material/styles";
import {Paper} from "@mui/material";

export const Item = styled(Paper)(({theme}) => ({
  ...theme.typography.body2,
  margin: theme.spacing(10, 0, 0, 0),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
