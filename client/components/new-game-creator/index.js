import React from 'react';

import PropTypes from 'prop-types';

import './style.css';


class NewGameCreator extends React.Component {
  state = {
    ownGameClicked: false,
  };
  showOwnGameForm = () => {
    if (this.state.ownGameClicked) {
      return (
        <>
          <input
            className="user-name"
            type="text"
            placeholder="номерок блатной"
          />
          <div className="game-button" onClick={() => this.props.runGame('own')}>
            поехали
          </div>
          <div
            className="game-button"
            onClick={() => this.setState({ ownGameClicked: false })}
          >
            назад
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="game-button" onClick={() => this.props.runGame('random')}>
            случайная игра
          </div>
          <div
            className="game-button"
            onClick={() => this.setState({ ownGameClicked: true })}
          >
            своя игра
          </div>
        </>
      );
    }
  };
  render() {
    return (
      <div className="new-game-creator">
        <input className="user-name" type="text" placeholder="твоё имя..." />
        {this.showOwnGameForm()}
      </div>
    );
  }
}
/*
export const NewGameCreator = ({ runGame }) => (
  <div className="new-game-creator">
    <input className="user-name" type="text" placeholder="твоё имя..." />
    <div className="game-button" onClick={()=>runGame(true)}>случайная игра</div>
    <div className="game-button" onClick={()=>runGame(false)}>своя игра</div>
  </div>
);
*/

NewGameCreator.propTypes = {
  runGame: PropTypes.func.isRequired,
};

export default NewGameCreator;
