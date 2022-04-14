import React, { FormEvent, useState } from 'react';
import RepoList from './RepoList';
import { Typography, makeStyles, Theme } from '@material-ui/core';
import NameForm from './NameForm';
import RepoError from './RepoError';
import api from 'services/api';
import RepoEmpty from './RepoEmpty';
import RepoOwner from './RepoOwner';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: '30px auto',
    maxWidth: 600,
    width: '100%',
    minHeight: '100vh',
    border: '2px solid #ddc6a3',
    padding: 20,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  form: {
    marginTop: 40,
  },
}));

const Repos: React.FC = () => {
  const classes = useStyles();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [repos, setRepos] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [owner, setOwner] = useState<any>(null);

  function fetchRepositories(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    if (!username) {
      setRepos([]);
      return;
    }

    setButtonDisabled(true);

    api
      .get(`/users/${username}/repos`)
      .then(response => {
        setRepos(response.data);
        setOwner(response.data[0].owner);
      })
      .catch(error => {
        console.error(error);
        setError(error.message);
        setRepos([]);
      })

      .finally(() => setButtonDisabled(false));
  }

  return (
    <div className={classes.container}>
      <Typography align="center" variant="h6">
        Repositórios GitHub
      </Typography>

      <form className={classes.form} onSubmit={fetchRepositories}>
        <NameForm username={username} setUsername={setUsername} buttonDisabled={buttonDisabled} />
      </form>

      {repos.length === 0 ? (
        <RepoEmpty />
      ) : error ? (
        <RepoError error={error} setError={setError} />
      ) : (
        <>
          <RepoOwner owner={owner} />
          <RepoList repos={repos} />
        </>
      )}
    </div>
  );
};

export default Repos;
