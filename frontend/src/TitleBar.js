import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import InputBase from '@material-ui/core/InputBase';
import SharedContext from './SharedContext';
import EmailIcon from '@material-ui/icons/Email';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';
import SaveIcon from '@material-ui/icons/Save';
import SendIcon from '@material-ui/icons/Send';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import {green} from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import {useMediaQuery} from '@material-ui/core';
import {useTheme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'fixed',
    zIndex: theme.zIndex.drawer +300,
    height: '55px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  menuButton: {
    marginRight: theme.spacing(0),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  searchbar: {
    justifyContent: 'space-around',
    marginLeft: theme.spacing(10),
    backgroundColor: 'white',
    width: '70vw',
    [theme.breakpoints.down('md')]: {
      marginLeft: theme.spacing(3),
      width: '100%',
    },
    paddingLeft: theme.spacing(2),
  },
  newMail: {
    textAlign: 'left',
  },
  composeBox: {
    marginTop: '55px',
    flexGrow: 1,
    width: '100%',
  },
  settings: {
    marginTop: '55px',
    flexGrow: 1,
    width: '100%',
  },
  dialogTitle: {
    display: 'flex',
    margin: 0,
    padding: theme.spacing(2),
  },
  appButtons: {
    display: 'flex',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      width: '50%',
    },
    justifyContent: 'flex-end',
  },
}));

const save = (username2, avatar, emailAddress, showAvatar) => {
  fetch(`http://localhost:3010/v0/user`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'username': username2,
      'email': emailAddress,
      'avatar': avatar,
      'avatarbool': showAvatar,
    }),
  });
};

/**
 * @return {oject} JSX
 */
function TitleBar() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {mailbox, toggleDrawerOpen, setSettings, searched,
    searchValue, setSearchValue, setSearchClick, changeSearched,
    avatar, username, emailAddress, showAvatar, setAvatarShow, setAvatar} =
    React.useContext(SharedContext);
  const [open, setOpen] = React.useState(false);
  const [toValue, setToValue] = React.useState('');
  const [contentValue, setContentValue] = React.useState('');
  const [subjectValue, setSubjectValue] = React.useState('');
  const [searchReader, setSearchReader] = React.useState('');
  const [avatar2, setAvatar2] = React.useState('');
  const [showAvatar2, setShowAvatar2] = React.useState(showAvatar);
  const handleClickOpen = () => {
    setOpen(true);
    setSettings(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const post = () => {
    console.log(toValue);
    console.log(subjectValue);
    console.log(contentValue);
    fetch(`http://localhost:3010/v0/mail`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'to-name': 'User',
        'to-email': toValue,
        'from-name': username,
        'from-email': emailAddress,
        'subject': subjectValue,
        'content': contentValue.replaceAll('\n', '\\n'),
      }),
    });
    setOpen(false);
    changeSearched(searched+1);
    setToValue('');
    setSubjectValue('');
    setContentValue('');
  };

  const [username2, setUsername2] = React.useState(username);

  const getUser = () => {
    console.log('called');
    fetch(`http://localhost:3010/v0/user/ericlee%40email.com`, {
      method: 'get',
    })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          setUsername2(json.username);
        })
        .catch((error) => {
        });
  };

  React.useEffect(() => {
    getUser();
  }, []);

  const back = () => {
    handleClickOpen();
  };

  const handleToChange = (e) => {
    setToValue(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubjectValue(e.target.value);
  };

  const handleContentChange = (e) => {
    setContentValue(e.target.value);
  };
  const onChange = (event) => {
    setSearchReader(event.target.value);
  };

  const handleChange = (event) => {
    setShowAvatar2(!showAvatar2);
  };
  // doesnt work until save
  console.log(username);
  const [usernameChange, changeUsername] = React.useState(username2);
  const handleUsernameChange = (e) => {
    console.log(usernameChange);
    changeUsername(e.target.value);
    setUsername2(e.target.value);
  };
  const {openSettings} =
    React.useContext(SharedContext);
  const handleSettingClose = () => {
    setSettings(false);
  };
  const classes = useStyles();
  const [openURL, setURLOpen] = React.useState(false);

  const handleClickURLOpen = () => {
    setURLOpen(true);
  };

  const handleURLClose = () => {
    setURLOpen(false);
  };
  const handleAvatarChange = (e) => {
    setAvatar2(e.target.value);
  };
  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawerOpen}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Hidden smDown implementation="css">
            <Typography
              style = {{
                width: '100%',
              }}
              variant="h6" noWrap>
              CSE183 Mailbox - {mailbox}
            </Typography>
          </Hidden>
          <InputBase className = {classes.searchbar}
            placeholder="Search mail..."
            onChange= {onChange}/>
          <IconButton onClick = {() => {
            console.log(searchValue);
            setSearchClick(true);
            changeSearched(searched+1);
            setSearchValue(searchReader);
          }}>
            <SearchIcon style = {{color: green[50]}}/>
          </IconButton>
          <div className = {classes.appButtons}>
            <IconButton onClick = {back}>
              <EmailIcon className = {classes.newMail}
                style = {{color: green[50]}}/>
            </IconButton>
            <IconButton onClick = {() =>{
              setSettings(true);
              setOpen(false);
              console.log('Settings');
            }}>
              <PersonIcon style = {{color: green[50]}}/>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleClose}
        fullScreen = {fullScreen}
        aria-labelledby="form-dialog-title"
        className = {classes.composeBox}
        maxWidth = {'lg'}
        fullWidth = {true}>
        <DialogTitle id="form-dialog-title"
          className = {classes.dialogTitle}>
          <IconButton
            style = {{
              position: 'absolute',
              left: theme.spacing(1),
              top: theme.spacing(1),
            }}
            onClick = {handleClose}>
            <BackIcon/>
          </IconButton>

          <IconButton
            style = {{
              position: 'absolute',
              right: theme.spacing(1),
              top: theme.spacing(1),
            }}
            onClick = {post}>
            <SendIcon/>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="toEmail"
            label="To"
            type="email"
            value = {toValue}
            onChange = {handleToChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="emailSubject"
            label="Subject"
            type="email"
            value = {subjectValue}
            onChange = {handleSubjectChange}
            fullWidth
          />
          <TextField
            style = {{
              marginTop: '20px',
            }}
            id="outlined-multiline-static"
            multiline
            rows={15}
            defaultValue=""
            variant="outlined"
            value = {contentValue}
            onChange = {handleContentChange}
            fullWidth
          />
        </DialogContent>
      </Dialog>

      <Dialog
        fullScreen = {fullScreen}
        maxWidth = {'md'}
        fullWidth = {true}
        className = {classes.settings}
        open= {openSettings} onClose= {handleSettingClose}>
        <DialogTitle id="customized-dialog-title" onClose={handleSettingClose}
          className = {classes.dialogTitle}>

          <IconButton
            style = {{
              position: 'absolute',
              left: theme.spacing(1),
              top: theme.spacing(1),
            }}
            onClick = {handleSettingClose}>
            <BackIcon/>
          </IconButton>
          <IconButton
            style = {{
              position: 'absolute',
              right: theme.spacing(1),
              top: theme.spacing(1),
            }}
            onClick = { () => {
              handleSettingClose();
              console.log('a ' + username2);
              console.log('avatar ' + avatar);
              setAvatarShow(avatar2);
              save(username2, avatar, emailAddress, showAvatar);
            }}>
            <SaveIcon/>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <IconButton onClick = {() => {
            handleClickURLOpen();
          }}>
            <Avatar
              style={{height: '200px', width: '200px'}}
              className = {classes.avatarPicture}
              alt = {username}
              src = {avatar} />
          </IconButton>
          <List style= {{
            paddingLeft: '60px',
            alignContent: 'center',
            textAlign: 'center',
            marginTop: '50px',
          }}>
            <ListItem>
              <TextField
                style= {{
                  paddingLeft: '0px',
                  alignContent: 'center',
                  textAlign: 'center',
                }}
                autoFocus
                id="toEmail"
                type="email"
                value = {username2}
                onChange = {handleUsernameChange}
              />
            </ListItem>
            <ListItem>
              {emailAddress}
            </ListItem>
            <ListItem>
              <Checkbox
                style= {{paddingLeft: '0px'}}
                checked={showAvatar2}
                onChange={handleChange}
                inputProps={{'aria-label': 'primary checkbox'}}
              />
              Show Avatar
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>

      <Dialog open={openURL} onClose={handleURLClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Enter URL</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="profilepicture"
            label="Image URL"
            type="email"
            value = {avatar2}
            onChange = {handleAvatarChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleURLClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={()=>{
              console.log(avatar2);
              handleURLClose();
              setAvatar(avatar2);
            }}
            color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TitleBar;
