import { useState } from "react";
import { FaUserCircle, FaCaretDown } from 'react-icons/fa';
import styled from "styled-components";
import { UserType } from "../types";

type Props = {
    user: UserType | null
    setUser: (value: UserType | null) => void
}
function Navbar({ user, setUser }: Props) {

    function logout() {
        localStorage.removeItem('token')
        setUser(null)
    }
    const [showLogout, setShowLogout] = useState(false);
    return (
        <Wrapper>
            <div className='nav-center'>
                <img src='/src/assets/advice.png' alt='coach app' />
                {user && (
                    <div className='btn-container'>
                        <button className='btn' onClick={() => setShowLogout(!showLogout)}>
                            <FaUserCircle />
                            {user.name}
                            <FaCaretDown />
                        </button>
                        <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'}>
                            <button onClick={() => logout()} className='dropdown-btn'>
                                logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.nav`
  height: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .nav-center {
    width: var(--fluid-width);
    max-width: var(--max-width);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .btn-container {
    position: relative;
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
    position: relative;
  }
  .dropdown {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    background: var(--white);
    padding: 0.5rem;
    text-align: center;
    visibility: hidden;
    transition: var(--transition);
    border-radius: var(--borderRadius);
  }
  .show-dropdown {
    visibility: visible;
  }
  .dropdown-btn {
    background: transparent;
    border-color: transparent;
    color: var(--primary-500);
    letter-spacing: var(--letterSpacing);
    text-transform: capitalize;
    cursor: pointer;
  }
`;

export default Navbar