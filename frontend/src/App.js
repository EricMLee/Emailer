import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import SharedContext from './SharedContext';
import TitleBar from './TitleBar';
import Content from './Content';
// import Content2 from './Content2';
import MailboxDrawer from './MailboxDrawer';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));

/**
 * @return {object} JSX
 */
function App() {
  const [fullname, setName] = React.useState('');
  const [avatar, setAvatar] = React.useState('');
  const [mailbox, setMailbox] = React.useState('Inbox');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchClick, setSearchClick] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [openSettings, setSettings] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [showAvatar, setAvatarShow] = React.useState(false);
  const [mailboxLister, addToList] = React.useState(false);
  const [searched, changeSearched] = React.useState(1);
  const [userInfo, changeUserInfo] = React.useState();
  const [user, changeUserName] = React.useState('');
  const emailAddress = 'ericlee@email.com';
  window.addEventListener('resize', () => {
    setDrawerOpen(false);
  });

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
          console.log(json);
          setAvatar(json.avatar);
          setUsername(json.username);
          setAvatarShow(json.showavatar);
          changeUserInfo(json);
        })
        .catch((error) => {
        });
  };

  React.useEffect(() => {
    getUser();
  }, []);

  // setEmail('ericlee@email.com');
  // getUser('ericlee@email.com');

  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline/>
      <SharedContext.Provider value= {{
        mailbox, setMailbox,
        drawerOpen, setDrawerOpen,
        toggleDrawerOpen,
        searchClick, setSearchClick,
        searchValue, setSearchValue,
        openSettings, setSettings,
        username, setUsername,
        showAvatar, setAvatarShow,
        mailboxLister, addToList,
        searched, changeSearched,
        user, changeUserName,
        fullname, setName,
        avatar, setAvatar,
        userInfo, emailAddress,
      }}
      >
        <MailboxDrawer/>
        <TitleBar/>
        {/* <Content/> */}
        <Content/>
      </SharedContext.Provider>
    </div>
  );
}

export default App;
