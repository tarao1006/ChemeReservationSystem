import React, { useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { getMe, login as loginAPI, validate as validateAPI } from '@api'
import { useAuth } from '@hooks'

const useStyles = makeStyles((theme) => ({
  userIdTextFieldBefore: {
    borderTopLeftRadius: theme.spacing(1.0),
    borderTopRightRadius: theme.spacing(1.0),
    borderBottomLeftRadius: theme.spacing(1.0),
    borderBottomRightRadius: theme.spacing(1.0),
  },
  userIdTextField: {
    borderTopLeftRadius: theme.spacing(1.0),
    borderTopRightRadius: theme.spacing(1.0),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  passwordTextField: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: theme.spacing(1.0),
    borderBottomRightRadius: theme.spacing(1.0),
  },
  formControlRoot: {
    marginTop: 0,
    marginBottom: 0,
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    right: theme.spacing(1.0),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}))

export const Login = () => {
  const classes = useStyles()
  const { setCurrentUser } = useAuth()
  const passwordInputEl = useRef(null)
  const [userId, setUserId] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [checked, setChecked] = useState<boolean>(false)
  const [isValidUserId, setIsValidUserId] = useState<boolean>(false)
  const [isInvalidUserId, setIsInvalidUserId] = useState<boolean>(false)
  const [isInvalidPassword, setIsInvalidPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const location = useLocation()
  let history = useHistory()

  const login = async (userId: string, password: string, rememberMe: boolean): Promise<void> => {
    setIsLoading(true)
    const res = await loginAPI(userId, password, rememberMe)
    if (res.code === 200) {
      const me = await getMe()
      setCurrentUser(me)
      setIsInvalidPassword(false)
      setIsLoading(false)
      history.push(location.pathname)
    } else {
      setIsInvalidPassword(true)
      setIsLoading(false)
    }
  }

  const validate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    const res = await validateAPI(userId)
    if (res.code === 200) {
      setIsValidUserId(true)
      setIsInvalidUserId(false)
      passwordInputEl.current.focus()
    } else {
      setIsValidUserId(false)
      setIsInvalidUserId(true)
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(userId, password, checked)
  }

  const handleUserId = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setIsValidUserId(false)
    setUserId(e.target.value)
  }

  const handlePassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(e.target.value)
  }

  const handleChecked = (
    _: React.ChangeEvent<HTMLInputElement>,
    newChecked: boolean
  ): void => {
    setChecked(newChecked);
  }

  const LoadingIcon = () => {
    return (
      <IconButton className={classes.inputIcon} size="small" disabled disableFocusRipple disableRipple>
        <CircularProgress size={25} />
      </IconButton>
    )
  }

  const UserIdInputIcon = () => {
    return (
      <IconButton
        className={classes.inputIcon}
        disabled={userId === ""}
        size="small"
        type="submit"
      >
        <ArrowForwardIcon />
      </IconButton>
    )
  }

  const PasswordInputIcon = () => {
    return (
      <IconButton
        className={classes.inputIcon}
        disabled={password === ""}
        size="small"
        type="submit"
      >
        <ArrowForwardIcon />
      </IconButton>
    )
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ログイン
        </Typography>
        <form className={classes.form} noValidate onSubmit={isValidUserId ? handleSubmit : validate}>
          <div className={classes.inputGroup}>
            <TextField
              value={userId}
              onChange={handleUserId}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="userId"
              placeholder="ユーザーID"
              name="username"
              autoComplete="username"
              autoFocus
              error={isInvalidUserId}
              helperText={isInvalidUserId ? "ユーザーIDが不正です": ""}
              classes={{ root: classes.formControlRoot }}
              InputProps={{
                className: isValidUserId ? classes.userIdTextField : classes.userIdTextFieldBefore
              }}
            />
            {isValidUserId ? null : isLoading ? <LoadingIcon /> : <UserIdInputIcon />}
          </div>
          <div className={classes.inputGroup}>
            <Fade in={isValidUserId}>
              <TextField
                inputRef={passwordInputEl}
                value={password}
                onChange={handlePassword}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                placeholder="パスワード"
                type="password"
                id="password"
                autoComplete="current-password"
                error={isInvalidPassword}
                helperText={isInvalidPassword ? "パスワードが不正です": ""}
                classes={{ root: classes.formControlRoot }}
                InputProps={{
                  className: classes.passwordTextField,
                }}
                style={{ top: '-1px' }}
              />
            </Fade>
            {!isValidUserId ? null : isLoading ? <LoadingIcon /> : <PasswordInputIcon />}
          </div>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleChecked} color="primary" />}
            label="ログインしたままにする"
          />
        </form>
      </div>
    </Container>
  )
}
