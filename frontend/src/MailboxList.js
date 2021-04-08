

import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
import MailIcon from '@material-ui/icons/Mail';
import SendIcon from '@material-ui/icons/Send';
import DraftsIcon from '@material-ui/icons/Drafts';
import ArrowIcon from '@material-ui/icons/ArrowForward';
import PlusIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';

import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import SharedContext from './SharedContext';
const boxes = [
  {name: 'Starred', icon: <StarIcon/>},
  {name: 'Sent', icon: <SendIcon/>},
  {name: 'Drafts', icon: <DraftsIcon/>},
  {name: 'Trash', icon: <DeleteIcon/>},
];

const customboxes = [
  {name: 'Work', icon: <ArrowIcon/>},
];

const fetchList = (setList) => {
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

/**
 * @return {object} JSX
 */
function MailboxList() {
  console.log('mailbox list');
  const [mailboxList, setList] = React.useState([]);
  const {mailbox, selectMailbox, addList} =
    React.useContext(SharedContext);
  const {searchClick, clickSearch, openSettingsBox} =
    React.useContext(SharedContext);
  const [mailboxName, setMailboxValue] = React.useState('');
  const handleMailboxChange = (e) => {
    setMailboxValue(e.target.value);
  };
  const [open, setOpen] = React.useState(false);
  const addMailbox = () => {
    addList(mailboxName);
    fetch(`http://localhost:3010/v0/mailbox`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'mailboxname': mailboxName,
        'mailboxcount': 0,
      }),
    });
    const newList = [...mailboxList, ({'mailboxname': mailboxName})];
    setList(newList);
    console.log(mailboxList);
    setMailboxValue('');
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    fetchList(setList);
  }, [customboxes]);

  // const countMail2 = (mailbox) => {
  //   const [emails2, setEmails2] = React.useState([]);
  //   fetch(`http://localhost:3010/v0/mail?mailbox=${mailbox.toLowerCase()}`, {
  //     method: 'get',
  //   }).then((response) => {
  //     if (!response.ok) {
  //       throw response;
  //     }
  //     return response.json();
  //   }).then((json) => {
  //     setEmails2(json);
  //   });
  //   console.log(emails2.length);
  //   let counter = 0;
  //   for (let i = 0; i < emails2.length; i++) {
  //     if (emails2[i].mail.readd == false) {
  //       counter++;
  //     }
  //   }
  //   return counter;
  // };
  // // React.useEffect(() => {
  // //   map()
  // // }, [mailbox]);
  // const mailboxListArray = ['Inbox', 'Starred', 'Trash'];
  // const mailboxUnreadCount = [];
  // const readThings = () => {
  //   for (let i = 0; i < mailboxListArray.length; i++) {
  //     mailboxUnreadCount.push(countMail2(mailboxListArray[i]));
  //   }
  //   console.log('mailbox' + mailboxListArray);
  //   console.log('mailbox' + mailboxUnreadCount);
  // };
  // readThings();


  // let mailboxUnread = [];

  // const countMail = (mailbox) => {
  //   console.log('called');
  //   return 0;
  //   // const [emails2, setEmails2] = React.useState([]);
  //   // fetch(`http://localhost:3010/v0/mail?mailbox=${mailbox.toLowerCase()}`, {
  //   //   method: 'get',
  //   // }).then((response) => {
  //   //   if (!response.ok) {
  //   //     throw response;
  //   //   }
  //   //   return response.json();
  //   // }).then((json) => {
  //   //   setEmails2(json);
  //   // });
  //   // console.log(emails2.length);
  //   // let counter = 0;
  //   // for (let i = 0; i < emails2.length; i++) {
  //   //   if (emails2[i].mail.readd == false) {
  //   //     counter++;
  //   //   }
  //   // }
  //   // return counter;
  // };
  // const getNumOfUnread = (mailbox) => {

  // };
  return (
    <div>
      <Toolbar />
      <List>
        <ListItem button
          key='Inbox'
          disabled={mailbox == 'Inbox'}
          onClick={() => selectMailbox('Inbox')}
        >
          <ListItemIcon>
            <MailIcon/>
          </ListItemIcon>
          <ListItemText primary='Inbox'/>
        </ListItem>
        <Divider variant = "middle" />

        {boxes.map((box) => (
          <ListItem button
            key={box.name}
            disabled={mailbox == box.name}
            onClick={() => {
              clickSearch(false);
              selectMailbox(box.name);
            }}>
            <ListItemIcon>
              {box.icon}
            </ListItemIcon>
            <ListItemText primary={box.name}/>
            {/* <ListItemText
              style = {{
                textAlign: 'right',
              }}
              primary={countMail(box.name)}/> */}
          </ListItem>
        ))}
        <Divider variant = "middle" />

        {mailboxList.map((box) => (
          <ListItem button
            key={box.mailboxname}
            disabled={mailbox == box.mailboxname}
            onClick={() => {
              clickSearch(false);
              selectMailbox(box.mailboxname);
              console.log(searchClick);
            }}>
            <ListItemIcon>
              <ArrowIcon/>
            </ListItemIcon>
            <ListItemText
              primary={box.mailboxname}/>
          </ListItem>
        ))}

        <Divider variant = "middle" />

        <ListItem button
          key='NewMailbox'
          disabled={mailbox == 'NewMailbox'}
          onClick = {() => setOpen(true)}
        >
          <ListItemIcon>
            <PlusIcon/>
          </ListItemIcon>
          <ListItemText primary='New Mailbox'/>
        </ListItem>
        <Divider variant = "middle" />

        <ListItem button
          key='Settings'
          disabled={mailbox == 'Settings'}
          onClick={() => openSettingsBox()}
        >
          <ListItemIcon>
            <SettingsIcon/>
          </ListItemIcon>
          <ListItemText primary='Settings'/>
        </ListItem>
      </List>
      <Dialog open={open} onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Mailbox</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of the new mailbox
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Mailbox Name"
            type="email"
            value = {mailboxName}
            onChange = {handleMailboxChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addMailbox} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MailboxList;
