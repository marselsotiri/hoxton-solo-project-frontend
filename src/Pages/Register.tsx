import { useState } from 'react';
import { Navigate } from 'react-router-dom'
import FormRow from '../Components/FormRow';
import { UserType } from '../types';
import styled from 'styled-components'

type Props = {
    user: UserType | null
    setUser: (value: UserType) => void
    showAlert: boolean
    setshowAlert: (value: boolean) => void
    isLoading: boolean
}

function Register({ user, setUser, showAlert,setshowAlert, isLoading }: Props) {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        isMember: true,
    });



    function register(name: string, email: string, password: string) {

        fetch('http://localhost:4000/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    alert('Oops, something went wrong.')
                } else {
                    // we managed to create our user!
                    localStorage.setItem('token', data.token)
                    setUser(data.user)
                }
            })
    }

    function login(email: string, password: string) {

        fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    alert(data.error)
                } else {
                    localStorage.token = data.token
                    setUser(data.user) // data === { user, token }
                }
            })
    }



    const toggleMember = () => {
        setValues({ ...values, isMember: !values.isMember });
    };
    const handleChange = (e: any) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    const onSubmit = (e: any) => {
        e.preventDefault();
        const { name, email, password, isMember } = values;

        if (isMember) {
            login(email, password);
        } else {
            register(name, email, password);
        }
    };

    return (
        <>
            {user && <Navigate to='/dashboard' />}
            <Wrapper className='page full-page'>
                <div className='container'>
                    {showAlert && (
                        <div className='alert alert-danger'>
                            there was an error, please try again
                        </div>
                    )}
                    <form className='form' onSubmit={onSubmit}>
                        <img src='src\assets\advice.png' alt='coach' className='logo' />
                        <h4>{values.isMember ? 'Login' : 'Register'}</h4>
                        {/* name field */}
                        {!values.isMember && (
                            <FormRow
                                type='name'
                                name='name'
                                value={values.name}
                                handleChange={handleChange}
                            />
                        )}

                        {/* single form row */}
                        <FormRow
                            type='email'
                            name='email'
                            value={values.email}
                            handleChange={handleChange}
                        />
                        {/* end of single form row */}
                        {/* single form row */}
                        <FormRow
                            type='password'
                            name='password'
                            value={values.password}
                            handleChange={handleChange}
                        />
                        {/* end of single form row */}
                        <button
                            type='submit'
                            className='btn btn-block'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Fetching User...' : 'Submit'}
                        </button>
                        <p>
                            {values.isMember ? 'Not a member yet?' : 'Already a member?'}

                            <button
                                type='button'
                                onClick={toggleMember}
                                className='member-btn'
                            >
                                {values.isMember ? 'Register' : 'Login'}
                            </button>
                        </p>
                    </form>
                </div>
            </Wrapper>
        </>
    );
}

const Wrapper = styled.section`
  display: grid;
  align-items: center;
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .form {
    max-width: 400;
    border-top: 5px solid var(--primary-500);
  }
  h4 {
    text-align: center;
  }
  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--primary-500);
    cursor: pointer;
  }
`;
export default Register