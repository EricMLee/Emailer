
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Content from './Content';
const useStyles = makeStyles((theme) => ({
  contents: {
    display: 'inline-flex',
  },
  leftContent: {
    width: 50,
    zIndex: theme.zIndex.drawer +200,
  },
  rightContent: {
    width: '50vw',
    height: '100vh',
    zIndex: theme.zIndex.drawer +200,
  },
}));

/**
 * @return {object} JSX
 */
function Content2() {
  const classes = useStyles();
  return (
    <div className = {classes.contents}>
      <Content className = {classes.leftContent}/>
      <Paper className = {classes.rightContent}>
        a
      </Paper>
    </div>
  );
}

export default Content2;
