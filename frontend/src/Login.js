import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App/>, document.getElementById('root'));

import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import {Input} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
const useStyles = makeStyles((theme) => ({
  wrapper: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue',
  },
  box: {
    // backgroundColor: 'orange',
    margin: 'auto',
    [theme.breakpoints.between('md', 'lg')]: {
      width: '50%',
    },
  },
  title: {
    paddingTop: 50,
    margin: 'none',
    fontSize: 40,
    textAlign: 'center',
  },
  username: {
    width: '80%',
    margin: 'none',
    height: 30,
    textAlign: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  password: {
    width: '80%',
    margin: 'none',
    height: 30,
    textAlign: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    justifyContent: 'space-between',
    margin: 'auto',
    width: '60%',
    display: 'flex',
  },
}));
/**
 * @return {object}
 */
function Login() {
  const [user, setUser] = React.useState({email: '', password: ''});

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };
  const classes = useStyles();
  return (
    <div className = {classes.wrapper}>
      <div className = {classes.box}>
        <h2 className = {classes.title}>Login</h2>
        <Box component = "span" display = "block" p = {4} m = {1}>
          <Input
            type = "username"
            name = "username"
            fullWidth = 'true'
            placeholder = "Username"
            onChange = {handleInputChange}
            required
          />
        </Box>
        <Box component = "span" display = "block" p = {4} m = {1}>
          <Input
            type = "password"
            name = "password"
            fullWidth = 'true'
            placeholder = "Password"
            onChange = {handleInputChange}
            required
          />
        </Box>
        <div className = {classes.buttonRow}>
          <FormControlLabel
            value = "remember"
            control = {<Checkbox color = "primary"/>}
            label = "Remember me"
            labelPlacement = "remember"
          />
          <Button variant = "contained" color = "primary">
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
