
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

import SharedContext from './SharedContext';
import MailboxList from './MailboxList';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer +200,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

/**
 * @return {object} JSX
 */
function MailboxDrawer() {
  const {mailbox, setMailbox, drawerOpen, setDrawerOpen,
    toggleDrawerOpen, searchClick, setSearchClick,
    mailboxLister, addToList, setSettings} =
    React.useContext(SharedContext);

  const clickSearch = (value) => {
    setSearchClick(value);
  };

  const selectMailbox= (mailbox) => {
    setMailbox(mailbox);
    setDrawerOpen(false);
  };

  const addList = (mailbox) => {
    addToList(!mailbox);
  };

  const openSettingsBox = () => {
    setSettings(true);
  };

  const classes = useStyles();
  return (
    <SharedContext.Provider
      value={{mailbox, selectMailbox, searchClick,
        clickSearch, mailboxLister, addList, openSettingsBox}} >
      <Hidden smDown implementation="css">
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{paper: classes.drawerPaper}}
        >
          <MailboxList/>
        </Drawer>
      </Hidden>
      <Hidden smUp implementation="css">
        <Drawer
          className={classes.drawer}
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawerOpen}
          ModalProps={{keepMounted: true}}
        >
          <MailboxList/>
        </Drawer>
      </Hidden>
    </SharedContext.Provider>
  );
}

export default MailboxDrawer;
