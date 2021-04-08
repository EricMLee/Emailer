
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import StarBorder from '@material-ui/icons/StarBorder';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import SharedContext from './SharedContext';
import {useTheme} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import ReplyIcon from '@material-ui/icons/Reply';
import {useMediaQuery} from '@material-ui/core';
import MoveIcon from '@material-ui/icons/MoveToInbox';
import BeforeIcon from '@material-ui/icons/NavigateBefore';
import NextIcon from '@material-ui/icons/NavigateNext';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import {Typography} from '@material-ui/core';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  contents: {
    width: '100%',
  },
  mailViewer: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  button: {
    width: '70%',
  },
  row: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'space-between',
    display: 'flex',
  },
  container: {
    float: 'left',
    width: '20%',
  },
  container2: {
    textAlign: 'right',
    width: '80%',
  },
  iconButton: {
    fontSize: 'default',
    [theme.breakpoints.down('sm')]: {
      fontSize: 'small',
    },
  },
  mailContent: {
    width: '100%',
    // paddingLeft: '10%',
    // paddingRight: '10%',
  },
  moveMail: {
    height: '60vh',
    marginTop: '20vh',
  },
  moveMailTitle: {
    paddingLeft: '50px',
    paddingRight: '50px',
    marginLeft: '100px',
    marginRight: '100px',
  },
  contentList: {
    display: '-webkit-box',
    boxOrient: 'vertical',
    lineClamp: 3,
    wordBreak: 'break-all',
    overflow: 'hidden',
  },
}));

const fetchList = (setList) => {
  console.log('called');
  fetch(`http://localhost:3010/v0/mailbox`, {
    method: 'get',
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        setList(json);
      })
      .catch((error) => {
      });
};


const fetchEmails = (setEmails, mailbox) => {
  console.log('called');
  fetch(`http://localhost:3010/v0/mail?mailbox=${mailbox.toLowerCase()}`, {
    method: 'get',
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        setEmails(json);
      })
      .catch((error) => {
      });
};

const searchForEmails = (setEmails, value) => {
  console.log('called');
  fetch(`http://localhost:3010/v0/mail?from=${value.toLowerCase()}`, {
    method: 'get',
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        setEmails(json);
      })
      .catch((error) => {
      });
};

const starEmail = (emailID) => {
  console.log('called');
  fetch(`http://localhost:3010/v0/mail/{id}?id=${emailID}&mailbox=star`, {
    method: 'put',
  });
};

const moveEmail = (emailID, destination) => {
  console.log('called');
  fetch(`http://localhost:3010/v0/mail/{id}?id=${emailID}&mailbox=${destination.toLowerCase()}`, {
    method: 'put',
  });
};

const searchEmail = (setEmail, emailID) => {
  if (emailID == undefined) {
    return;
  }
  console.log('called');
  fetch(`http://localhost:3010/v0/mail/${emailID}`, {
    method: 'get',
  }).then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }).then((json) => {
    setEmail(json);
  }).catch((error) => {

  });
};

const deleteEmail = (emailID) => {
  console.log('called');
  fetch(`http://localhost:3010/v0/mail/{id}?id=${emailID}`, {
    method: 'delete',
  });
};

// const starMail = (emailID) => {
//   // fetch(`http://localhost:3010/v0/mail?mailbox=${mailbox.toLowerCase()}`, {
//   fetch('http://localhost:3010/v0/mail', {
//     method: 'get',
//   })
//       .then((response) => {
//         if (!response.ok) {
//           throw response;
//         }
//         return response.json();
//       })
//       .then((json) => {
//         setEmails(json);
//       })
//       .catch((error) => {
//         setEmails([]);
//       });
// };

/**
 * @return {object} JSX
 */
function Content() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {mailbox, searchClick, searchValue, setSearchValue,
    setSearchClick, searched, changeSearched, emailAddress, username} =
    React.useContext(SharedContext);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const [emails, setEmails] = React.useState([]);
  const [emailView, setEmailView] = React.useState(false);
  const [currentEmail, changeEmail] = React.useState();
  const [emailLooker, setEmail] = React.useState([]);

  const [mailboxList, setList] = React.useState([]);

  // const [starCheck, setStarCheck] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [openMove, setMoveOpen] = React.useState(false);
  const [toValue, setToValue] = React.useState('');
  const [contentValue, setContentValue] = React.useState('');
  const [subjectValue, setSubjectValue] = React.useState('');

  const [starEmailTrigger, toggleStar] = React.useState(0);

  React.useEffect(() => {
    fetchList(setList);
  }, [openMove]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickMoveOpen = () => {
    setMoveOpen(true);
  };

  const handleMoveClose = () => {
    setMoveOpen(false);
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
        'content': contentValue,
      }),
    });
    setOpen(false);
    changeSearched(searched+1);
    setToValue('');
    setSubjectValue('');
    setContentValue('');
  };

  const reply = () => {
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

  // const [starCheck, setStarCheck] = React.useState([emailLooker.star]);

  const getDate = (date) => {
    const dateRead = new Date(date);
    const todaysDate = new Date();
    if (todaysDate.getMonth() == dateRead.getMonth() &&
      todaysDate.getDate() == dateRead.getDate()) {
      if (dateRead.getHours() > 12) {
        return dateRead.getHours()-12 + ':' + dateRead.getMinutes() + ' pm';
      } else if (dateRead.getHours() == 0) {
        return 12 + ':' + dateRead.getMinutes() + 'am';
      } else {
        return dateRead.getHours() + ':' + dateRead.getMinutes() + 'am';
      }
    }
    if (todaysDate.getFullYear() != dateRead.getFullYear()) {
      return dateRead.getFullYear();
    }
    return monthNames[dateRead.getMonth()] + ' ' + dateRead.getDate();
  };

  const [testing, setTesting] = React.useState(1);

  const back = () => {
    console.log(testing);
    setEmailView(false);
    setTesting(testing + 1);
    console.log(testing);
  };

  React.useEffect(() => {
    if (!searchClick) {
      console.log('true');
      fetchEmails(setEmails, mailbox);
    } else {
      searchForEmails(setEmails, searchValue);
      console.log('false');
    }
  }, [mailbox, starEmailTrigger, searched, testing]);

  React.useEffect(() => {
    if (currentEmail != undefined) {
      searchEmail(setEmail, currentEmail);
    }
  }, [currentEmail]);
  const classes = useStyles();
  if (emailView) {
    return (
      <div className = {classes.contents}>
        <Paper className={classes.mailViewer}>
          <Toolbar/>
          <div className = {classes.row}>
            <div className = {classes.container}>
              <IconButton onClick = {() => {
                back();
              }}>
                <BackIcon/>
              </IconButton>
            </div>
            <div className = {classes.container2}>

              <IconButton onClick = {() => {
                starEmail(currentEmail);
                // setStarCheck(!starCheck);
                setEmail({
                  'star': !emailLooker.star,
                  'subject': emailLooker.subject,
                  'content': emailLooker.content,
                  'from': emailLooker.from,
                  'to': emailLooker.to,
                  'sent': emailLooker.sent,
                  'received': emailLooker.received,
                  'mailbox': emailLooker.mailbox,
                });
              }}>
                {emailLooker.star && <StarIcon color = 'primary'/>}
                {!emailLooker.star && <StarBorder color = 'primary'/>}
              </IconButton>


              <IconButton
                disabled = {emails.sort(function(x, y) {
                  return new Date(y.mail.sent) - new Date(x.mail.sent);
                }).findIndex((obj) => obj.id ==
                  currentEmail) == 0}
                onClick = {() => {
                  emails.sort(function(x, y) {
                    return new Date(y.mail.sent) - new Date(x.mail.sent);
                  });
                  const currentIndex =
                    emails.findIndex((obj) => obj.id == currentEmail);
                  console.log(emails.length);
                  changeEmail(emails[currentIndex - 1].id);
                }}>
                <BeforeIcon/>
              </IconButton>

              <IconButton
                disabled = {emails.sort(function(x, y) {
                  return new Date(y.mail.sent) - new Date(x.mail.sent);
                }).findIndex((obj) => obj.id ==
                  currentEmail) + 1 == emails.length}
                onClick = {() => {
                  emails.sort(function(x, y) {
                    return new Date(y.mail.sent) - new Date(x.mail.sent);
                  });
                  const currentIndex =
                    emails.findIndex((obj) => obj.id == currentEmail);
                  console.log(emails.length);
                  changeEmail(emails[currentIndex + 1].id);
                }}>
                <NextIcon/>
              </IconButton>

              <IconButton onClick = {() => {
                setToValue(emailLooker.from.email);
                setSubjectValue('RE: ' + emailLooker.subject);
                reply();
              }}>
                <ReplyIcon/>
              </IconButton>
              <IconButton onClick = {() => {
                handleClickMoveOpen();
              }}>
                <MoveIcon/>
              </IconButton>
              <IconButton onClick = {() => {
                setEmailView(false);
                deleteEmail(currentEmail);
              }}>
                <DeleteIcon/>
              </IconButton>
            </div>
          </div>
          <div className = {classes.mailContent}>
            <h2>{emailLooker.subject}</h2>
            <p>{emailLooker.mailbox}</p>
            {emailLooker.from != undefined &&
              emailLooker.to != undefined &&
              <div>
                <Avatar alt= {emailLooker.from.name}
                  src="/static/images/avatar/1.jpg"
                  style = {{float: 'left'}}/>
                <div>
                  <h3 style = {{margin: '0', paddingLeft: '50px'}}>
                    From: {emailLooker.from.name} - {emailLooker.from.email}
                  </h3>
                  <h3 style = {{margin: '0', paddingLeft: '50px'}}>
                    To: {emailLooker.to.name} - {emailLooker.to.email}
                  </h3>
                </div>
              </div>}
            <p style = {{fontSize: '11px'}}>
              {monthNames[new Date(emailLooker.sent).getMonth()] + ' '}
              {new Date(emailLooker.sent).getDate() + ', '}
              {new Date(emailLooker.sent).getFullYear() + ' at '}
              {new Date(emailLooker.sent).getHours() == 0 && '12:'}
              {new Date(emailLooker.sent).getHours() > 12 &&
                new Date(emailLooker.sent).getHours() - 12 + ':'}
              {new Date(emailLooker.sent).getHours() < 12 &&
                new Date(emailLooker.sent).getHours() != 0 &&
                new Date(emailLooker.sent).getHours() + ':'}
              {new Date(emailLooker.sent).getMinutes()}
              {new Date(emailLooker.sent).getHours() >= 12 && 'pm'}
              {new Date(emailLooker.sent).getHours() < 12 && 'am'}
            </p>
            {/* {emailLooker.from != undefined &&
              <h3>From: {emailLooker.from.name}
              - {emailLooker.from.email}</h3>} */}
            {emailLooker.content != undefined &&
              <Typography>
                {emailLooker.content}
              </Typography>
            }

          </div>
        </Paper>

        <Dialog className = {classes.moveMail}
          open={openMove} onClose={handleMoveClose}
          aria-labelledby="form-dialog-title">
          <DialogTitle className = {classes.moveMailTitle}>
            Move email to...
          </DialogTitle>
          <List>
            <ListItem button onClick={() => {
              console.log(currentEmail);
              console.log('Inbox');
              moveEmail(currentEmail, 'inbox');
            }}
            key={'InboxList'}>
              <ListItemText primary={'Inbox'} />
            </ListItem>

            <ListItem button onClick={() => {
              console.log(currentEmail);
              moveEmail(currentEmail, 'trash');
            }}
            key={'TrashList'}>
              <ListItemText primary={'Trash'} />
            </ListItem>

            {mailboxList.map((mailbox) => (
              <ListItem button onClick={() => {
                console.log(currentEmail);
                console.log(mailbox.mailboxname);
                moveEmail(currentEmail, mailbox.mailboxname);
                handleMoveClose();
              }}
              key={mailbox.mailboxname}>
                <ListItemText primary={mailbox.mailboxname} />
              </ListItem>
            ))}
          </List>
        </Dialog>

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
      </div>
    );
  } else {
    if (mailbox == 'Sent') {
      return (
        <Paper className={classes.paper}>
          <Toolbar/>
          <List>
            {emails.sort(function(x, y) {
              return new Date(y.mail.sent) - new Date(x.mail.sent);
            }).map((email, index) => (
              <ListItem key = {email.id} alignItems = "flex-start">
                <ListItemAvatar>
                  <Avatar alt= {email.mail.to.name}
                    src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItem button
                  className = {classes.button}
                  key= 'test'
                  onClick={() => {
                    changeEmail(email.id);
                    setEmailView(true);
                  }}
                >
                  {/* {email.mail.to.name == 'User' &&
                  <ListItemText
                    primary= {email.mail.to.email + ' - '+ email.mail.subject +
                      ' - ' + email.name}
                    secondary={
                      <div className = {classes.contentList}>
                        {email.mail.content}
                      </div>
                    }
                  />}
                  {email.mail.to.name != 'User' &&
                    <ListItemText
                      primary= {email.mail.to.name + ' - '+ email.mail.subject +
                        ' - ' + email.name}
                      secondary={
                        <React.Fragment>
                          {' Description ' + email.mail.content}
                        </React.Fragment>
                      }
                    />} */}
                  {email.mail.to.name != 'User' &&
                    <Box
                      fontWeight='fontWeightRegular'
                      fontSize='h6.fontSize'
                      component='div'
                      classes={{root: classes.contentList}}
                    >
                      To: {email.mail.to.name}
                      <br/>
                      {email.mail.subject}
                      <br/>
                      {email.mail.content}
                    </Box>}
                  {email.mail.to.name == 'User' &&
                    <Box
                      fontWeight='fontWeightRegular'
                      fontSize='h6.fontSize'
                      component='div'
                      classes={{root: classes.contentList}}
                    >
                      To: {email.mail.to.email}
                      <br/>
                      {email.mail.subject}
                      <br/>
                      {email.mail.content}
                    </Box>}
                </ListItem>
                <ListItemText primary = {getDate(email.mail.sent)}
                  secondary = {
                    <IconButton color="primary"
                      aria-label="upload picture"
                      component="span"
                      onClick = {() => {
                        starEmail(email.id);
                        toggleStar(starEmailTrigger+1);
                      }}>
                      {email.mail.star == true && <StarIcon />}
                      {email.mail.star == false && <StarBorder />}
                    </IconButton>
                  }/>
              </ListItem>
            ))}
          </List>
        </Paper>
      );
    } else {
      return (
        <Paper className={classes.paper}>
          <Toolbar/>
          {searchClick &&
              <IconButton onClick = {() => {
                console.log('go back');
                setSearchClick(false);
                console.log('here');
                changeSearched(searched+1);
                setSearchValue(undefined);
              }}>
                <BackIcon/>
              </IconButton>}
          <List>
            {emails.sort(function(x, y) {
              return new Date(y.mail.sent) - new Date(x.mail.sent);
            }).map((email, index) => (
              <ListItem key = {email.id} alignItems = "flex-start">
                <ListItemAvatar>
                  <Avatar alt= {email.mail.from.name}
                    src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItem button
                  className = {classes.button}
                  key= {email.id}
                  onClick={() => {
                    console.log(email.id);
                    changeEmail(email.id);
                    console.log(email.mail.readd);
                    setEmailView(true);
                  }}
                >
                  {email.mail.readd == false &&
                  <Box
                    fontSize='h6.fontSize'
                    component='div'
                    fontWeight='fontWeightBold'
                    classes={{root: classes.contentList}}
                  >
                    {email.mail.from.name}
                    <br/>
                    {email.mail.subject}
                    <br/>
                    {email.mail.content}
                  </Box>}
                  {email.mail.readd == true &&
                    <Box
                      fontSize='h6.fontSize'
                      component='div'
                      fontWeight='fontWeightRegular'
                      classes={{root: classes.contentList}}
                    >
                      {email.mail.from.name}
                      <br/>
                      {email.mail.subject}
                      <br/>
                      {email.mail.content}
                    </Box>}
                  {/* {emails.readd == false &&
                    <Box
                      fontSize='h6.fontSize'
                      fontWeight='fontWeightBold'
                      component='div'
                      classes={{root: classes.contentList}}
                    >
                      {email.mail.from.name}
                      <br/>
                      {email.mail.subject}
                      <br/>
                      {email.mail.content}
                    </Box>} */}
                  {/* <ListItemText
                    primary= {email.mail.from.name + ' - '+ email.mail.subject +
                      ' - ' + email.name}
                    secondary={
                      <React.Fragment>
                        {' Description ' + email.mail.content}
                      </React.Fragment>
                    }
                  /> */}
                </ListItem>
                <ListItemText primary = {getDate(email.mail.sent)}
                  secondary = {
                    <IconButton color="primary"
                      aria-label="upload picture"
                      component="span"
                      onClick = {() => {
                        starEmail(email.id);
                        toggleStar(starEmailTrigger+1);
                      }}>
                      {email.mail.star == true && <StarIcon />}
                      {email.mail.star == false && <StarBorder />}
                    </IconButton>
                  }/>
              </ListItem>
            ))}
          </List>
        </Paper>
      );
    }
  }
}

export default Content;
