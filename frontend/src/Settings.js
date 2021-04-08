import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import SharedContext from './SharedContext';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import {useMediaQuery} from '@material-ui/core';
import {useTheme} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({

}));


const styles = (theme) => ({
  root: {
    display: 'flex',
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    left: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  saveButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  // avatarPicture: {
  //   height: '200px',
  //   width: '200px',
  //   marginLeft: '50px',
  // },
});


const DialogContent = withStyles((theme) => ({
  root: {
    display: 'flex',
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    display: 'flex',
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


/**
 * @return {object} JSX
 */
function Settings() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const DialogTitle = withStyles(styles)((props) => {
    const {classes, onClose, ...other} = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <IconButton aria-label="close"
          className={classes.saveButton} onClick={() => {
            console.log(usernameChange);
          }}>
          <SaveIcon />
        </IconButton>
        <IconButton aria-label="close"
          className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
    );
  });
  const [checked, setChecked] = React.useState(true);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const [usernameChange, changeUsername] = React.useState('Eric Lee');
  const handleUsernameChange = (e) => {
    changeUsername(e.target.value);
  };
  const username = 'Eric Leee';
  const avatar = 'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTQ3NjM5ODIyNjU0MTIxMDM0/snoop_dogg_photo_by_estevan_oriol_archive_photos_getty_455616412.jpg';
  const {openSettings, setSettings} =
    React.useContext(SharedContext);
  const handleSettingClose = () => {
    setSettings(false);
  };

  const classes = useStyles();
  return (
    <div>
      <Toolbar/>
      <Dialog
        fullScreen = {fullScreen}
        maxWidth = {'md'}
        fullWidth = {true}
        className = {classes.settings}
        open= {openSettings} onClose= {handleSettingClose}>
        <DialogTitle id="customized-dialog-title" onClose={handleSettingClose}>
          Modal title
        </DialogTitle>
        <DialogContent>
          <Avatar
            style={{height: '200px', width: '200px',
              marginLeft: '50px', marginTop: '50px'}}
            className = {classes.avatarPicture}
            alt = {username}
            src = {avatar} />
          <List style= {{
            paddingLeft: '60px',
            marginTop: '50px',
          }}>
            <ListItem>
              <TextField
                style= {{paddingLeft: '0px'}}
                autoFocus
                id="toEmail"
                type="email"
                value = {usernameChange}
                onChange = {handleUsernameChange}
              />
            </ListItem>
            <ListItem>
              EricLee@ucsc.edu
            </ListItem>
            <ListItem>
              <Checkbox
                style= {{paddingLeft: '0px'}}
                checked={checked}
                onChange={handleChange}
                inputProps={{'aria-label': 'primary checkbox'}}
              />
              Show Avatar
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSettingClose} color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Settings;
