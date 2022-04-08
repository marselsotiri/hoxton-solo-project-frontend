import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { PlayerType } from '../types';
import PlayerColumns from './PlayerColumns';
import moment from 'moment';
import styled from 'styled-components';

type Props = {
  isLoading: boolean
  players: PlayerType[]
  setPlayers: (value: PlayerType[]) => void
  setLoading: (value: boolean) => void
}

function Players({ isLoading, players, setPlayers, setLoading }: Props) {

  function deletePlayer(id: number) {
    setLoading(true)
    if (players === null) return

    // remove order from the server
    fetch(`http://localhost:4000/players/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: localStorage.token
      }
    })
      .then(resp => resp.json())
      .then(players => {
        // check if an error came back
        if (players.error) return

        // now we know for sure that data is our updated user
        setPlayers(players)
        setLoading(false)
      })
  }


  if (isLoading) {
    return <div className='loading'></div>;
  }

  if (players.length < 1) {
    return (
      <EmptyContainer>
        <h5>
          Currently, you have no <span>Players </span>
          to display
        </h5>
      </EmptyContainer>
    );
  }

  return (
    <>
      <PlayerColumns />
      <Container>
        {players.map((item) => {
          const { id, fullName, position, team,
            status,
            //@ts-ignore
            createdAt } = item;
          let date = moment(createdAt);
          //@ts-ignore
          date = date.format('MMMM Do, YYYY');
          return (
            <article key={id} className='player'>
              <span className='icon'>{fullName.charAt(0)}</span>
              <span className='name'>{fullName.toLowerCase()}</span>
              <span className='position'>{position.toLowerCase()}</span>
              <span className='team'>{team}</span>
              <span className='date'>{date}</span>
              <StatusContainer className='status'
                // @ts-ignore
                status={status}>
                {status}
              </StatusContainer>
              <div className='action-div'>
                <Link to={`/edit/${id}`} className='edit-btn' type='button'>
                  <FaEdit />
                </Link>
                <button
                  className=' delete-btn'
                  type='button'
                  onClick={() => deletePlayer(id)}
                >
                  <FaTrash />
                </button>
              </div>
            </article>
          );
        })}
      </Container>
    </>
  );
};

const EmptyContainer = styled.section`
  text-align: center;
  h5 {
    text-transform: none;
  }
  span {
    color: var(--primary-500);
  }
`;
const Container = styled.section`
  .player {
    background: var(--white);
    border-radius: var(--borderRadius);
    margin-bottom: 2rem;
    display: grid;
    padding: 2rem 0;
    justify-content: center;
    text-align: center;
  }
  .icon {
    background: var(--primary-500);
    display: block;
    border-radius: var(--borderRadius);
    color: var(--white);
    font-size: 2rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    margin-bottom: 1rem;
  }
  span {
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
  }
  .position {
    font-weight: 600;
  }
  .date {
    color: var(--grey-500);
  }
  .status {
    border-radius: var(--borderRadius);
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
    text-align: center;
    margin: 0.75rem auto;
    width: 100px;
  }
  .edit-btn {
    color: var(--green-dark);
    border-color: transparent;
    background: transparent !important;
    outline: transparent;
    border-radius: var(--borderRadius);
    cursor: pointer;
    display: inline-block;
    appearance: none;
  }
  .delete-btn {
    color: var(--red-dark);
    border-color: transparent;
    border-radius: var(--borderRadius);
    cursor: pointer;
    background: transparent;
  }
  .edit-btn,
  .delete-btn {
    font-size: 1rem;
    line-height: 1.15;
    margin-bottom: -3px;
  }
  .action-div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
  }
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
  }
  @media (min-width: 992px) {
    grid-template-columns: 1fr;
    .icon {
      display: none;
    }
    background: var(--white);
    border-bottom-left-radius: var(--borderRadius);
    border-bottom-right-radius: var(--borderRadius);
    .player {
      border-radius: 0;
      justify-content: left;
      text-align: left;
      border-bottom: 1px solid var(--grey-200);
      grid-template-columns: 1fr 1fr 1fr 150px 100px 100px;
      align-items: center;
      padding: 1rem 1.5rem;
      column-gap: 1rem;
      margin-bottom: 0;
    }
    .player:last-child {
      border-bottom: none;
    }
    span {
      font-size: var(--small-text);
    }
    .name,
    .position,
    .team {
      font-weight: 400;
      text-transform: capitalize;
    }
    .date {
      font-weight: 400;
      color: var(--grey-500);
    }
    .status {
      font-size: var(--smallText);
    }
    .action-div {
      margin-left: 1rem;
      justify-content: left;
    }
  }
`;
const setStatusColor = (status: string) => {
  if (status === 'interview') return '#0f5132';
  if (status === 'declined') return '#842029';
  return '#927238';
};
const setStatusBackground = (status: string) => {
  if (status === 'interview') return '#d1e7dd';
  if (status === 'declined') return '#f8d7da';
  return '#f7f3d7';
};


const StatusContainer = styled.span`
  border-radius: var(--borderRadius);
  text-transform: capitalize;
  letter-spacing: var(--letterSpacing);
  text-align: center;
 
  color: ${(props) => setStatusColor(props.
  // @ts-ignore
  status)};
  background: ${(props) => setStatusBackground(props.
    // @ts-ignore
    status)};
`;



export default Players