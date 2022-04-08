import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import styled from "styled-components";
import FormRow from "../Components/FormRow";
import Navbar from "../Components/Navbar";
import { PlayerType, UserType } from "../types";

type Props = {
    user: UserType | null
    setUser: (value: UserType | null) => void
    isLoading: boolean
    setLoading: (value: boolean) => void
}

function Edit({ user, setUser, isLoading, setLoading }: Props) {

    const [editComplete, seteditComplete] = useState<boolean>(false)
    const [editItem, seteditItem] = useState<PlayerType | null>(null)


    const parameter = useParams();
    let id = Number(parameter.id)


    const [values, setValues] = useState({
        fullName: '',
        position: '',
        team: '',
        status: '',
    });

    useEffect(() => {
        getSinglePlayer(id);
    }, [id]);


    function getSinglePlayer(id: number) {
        setLoading(true)
        if (localStorage.token) {
            fetch(`http://localhost:4000/players/${id}`, {
                headers: {
                    Authorization: localStorage.token
                }
            })
                .then(resp => resp.json())
                .then(player => {
                    if (player.error) {
                        console.log('Validation failed.')
                    } else {
                        seteditItem(player)
                        setLoading(false)
                    }
                })
        }
    }



    function editPlayer(playerId: number, name: string, position: string, team: string, status: string) {
        // update order on server
        seteditComplete(true)
        fetch(`http://localhost:4000/player/${playerId}`, {
            method: 'PATCH',
            headers: {
                Authorization: localStorage.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullName: name, position, team, status })
        })
            .then(resp => resp.json())
            // update state
            .then(updatedPlayer => seteditItem(updatedPlayer))
    }

    useEffect(() => {
        if (editItem) {
            const { fullName, position, team, status } = editItem;
            setValues({ fullName, position, team, status });
        }
    }, [editItem]);

    const handleChange = (e: any) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const { fullName, position, team, status } = values;
        if (fullName && position && team) {
            editPlayer(id, fullName, position, team, status)
        }
    };
    if (isLoading && !editItem) {
        return <div className='loading'></div>;
    }

    if (!editItem) {
        return (
            <>
                {!user && <Navigate to='/' />}
                <ErrorContainer className='page'>
                    <h5>There was an error, please double check your job ID</h5>

                    <Link to='/dashboard' className='btn'>
                        dasboard
                    </Link>
                </ErrorContainer>
            </>
        );
    }
    return (
        <>
            {!user && <Navigate to='/' />}
            <Navbar user={user} setUser={setUser} />
            <Container className='page'>
                <header>
                    <Link to='/dashboard' className='btn btn-block back-home'>
                        back home
                    </Link>
                </header>
                <form className='form' onSubmit={handleSubmit}>
                    <p>{editComplete && 'Success! Edit Complete'}</p>
                    <h4>Update Player</h4>
                    {/* Player */}
                    <div className='form-container'>
                        <FormRow
                            type='name'
                            name='fullName'
                            value={values.fullName}
                            handleChange={handleChange}
                        />
                        <FormRow
                            type='name'
                            name='position'
                            value={values.position}
                            handleChange={handleChange}
                        />
                        <FormRow
                            type='name'
                            name='team'
                            value={values.team}
                            handleChange={handleChange}
                        />
                        <div className='form-row'>
                            <label htmlFor='status' className='form-label'>
                                Status
                            </label>
                            <select
                                name='status'
                                value={values.status}
                                onChange={handleChange}
                                className='status'
                            >
                                <option value='pending'>pending</option>
                                <option value='interview'>interview</option>
                                <option value='declined'>declined</option>
                            </select>
                        </div>
                        <button
                            type='submit'
                            className='btn btn-block submit-btn'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Editing...' : 'Edit'}
                        </button>
                    </div>
                </form>
            </Container>
        </>
    );
}
const ErrorContainer = styled.section`
    text-align: center;
    padding-top: 6rem; ;
  `;

const Container = styled.section`
    header {
      margin-top: 4rem;
    }
    .form {
      max-width: var(--max-width);
      margin-top: 2rem;
    }
    .form h4 {
      text-align: center;
    }
    .form > p {
      text-align: center;
      color: var(--green-dark);
      letter-spacing: var(--letterSpacing);
      margin-top: 0;
    }
    .status {
      background: var(--grey-100);
      border-radius: var(--borderRadius);
      border-color: transparent;
      padding: 0.25rem;
    }
    .back-home {
      text-align: center;
      display: block;
      width: 100%;
      font-size: 1rem;
      line-height: 1.15;
      background: var(--black);
    }
    .back-home:hover {
      background: var(--grey-500);
    }
    @media (min-width: 768px) {
      .back-home {
        width: 200px;
      }
      .form h4 {
        text-align: left;
      }
      .form-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 100px auto;
        column-gap: 0.5rem;
        align-items: center;
      }
      .form > p {
        text-align: left;
      }
      .form-row {
        margin-bottom: 0;
      }
      .submit-btn {
        align-self: end;
      }
    }
  `;



export default Edit