import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import FormRow from '../Components/FormRow';
import Navbar from '../Components/Navbar';
import Players from '../Components/Players';
import { PlayerType, UserType } from '../types';

type Props = {
    showAlert: boolean
    setshowAlert: (value: boolean) => void
    isLoading: boolean
    user: UserType | null
    setUser: (value: UserType | null) => void
    setLoading: (value: boolean) => void
}

function Dashboard({ showAlert, setshowAlert, isLoading, user, setUser, setLoading }: Props) {
    const [values, setValues] = useState({ name: '', position: '', team: '' });

    const [players, setPlayers] = useState<PlayerType[]>([])


    const handleChange = (e: any) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };


    function getPlayers() {
        if (localStorage.token) {
            setLoading(true)
            fetch('http://localhost:4000/players', {
                headers: {
                    Authorization: localStorage.token
                }
            })
                .then(resp => resp.json())
                .then(data => {
                    if (data.error) {
                        console.log('Validation failed.')
                    } else {
                        setPlayers(data)
                        setLoading(false)
                    }
                })
        }
    }

    function createPlayer(fullName: string, position: string, team: string) {
        if (localStorage.token) {
            setLoading(false)
            fetch('http://localhost:4000/players', {
                method: 'POST',
                headers: {
                    Authorization: localStorage.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullName, position, team })
            })
                .then(resp => resp.json())
                .then(players => {
                    if (players.error) {
                        console.log('Validation failed.')
                    } else {
                        setPlayers(players)
                        setLoading(false)
                        setshowAlert(false)
                    }
                })
        }
    }



    const handleSubmit = (e: any) => {
        e.preventDefault();
        const { name, position, team } = values;
        if (name && position && team) {
            createPlayer(name, position, team);
            setValues({ name: '', position: '', team: '' });
        } else { setshowAlert(true) }
    };
    useEffect(() => {
        getPlayers();
    }, []);
    return (
        <>
            {user === null && <Navigate to='/' />}
            <Navbar user={user} setUser={setUser} />

            <Wrapper className='page'>
                {showAlert && (
                    <div className='alert alert-danger'>
                        there was an error, please try again
                    </div>
                )}
                <form className='player-form' onSubmit={handleSubmit}>
                    {/* name */}
                    <FormRow
                        type='name'
                        name='name'
                        value={values.name}
                        handleChange={handleChange}
                        horizontal
                        placeholder='Name'
                    />
                    {/* position */}
                    <FormRow
                        type='name'
                        name='position'
                        value={values.position}
                        handleChange={handleChange}
                        horizontal
                        placeholder='Position'
                    />
                    {/* team */}
                    <FormRow
                        type='name'
                        name='team'
                        value={values.team}
                        handleChange={handleChange}
                        horizontal
                        placeholder='Team'
                    />
                    <button type='submit' className='btn' disabled={isLoading}>
                        {isLoading ? 'Adding New Player...' : 'Add Player'}
                    </button>
                </form>

                <Players isLoading={isLoading} players={players} setPlayers={setPlayers} setLoading={setLoading} />
            </Wrapper>
        </>
    );
}

const Wrapper = styled.section`
  padding: 3rem 0;
  .player-form {
    background: var(--white);
    display: grid;
    row-gap: 1rem;
    column-gap: 0.5rem;
    align-items: center;
    margin-bottom: 3rem;
    border-radius: var(--borderRadius);
    padding: 1.5rem;
    .form-input {
      padding: 0.75rem;
    }
    .form-input:focus {
      outline: 1px solid var(--primary-500);
    }
    .form-row {
      margin-bottom: 0;
    }
    .btn {
      padding: 0.75rem;
    }
    @media (min-width: 776px) {
      grid-template-columns: 1fr 1fr 1fr auto;
      .btn {
        height: 100%;
        padding: 0 2rem;
      }
      column-gap: 2rem;
    }
  }
  .alert {
    max-width: var(--max-width);
    margin-bottom: 1rem;
  }
`;


export default Dashboard