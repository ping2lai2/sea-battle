import React from 'react';

import PropTypes from 'prop-types';

import './style.css';

class NewGameCreator extends React.Component {
  state = {
    ownGameClicked: false,
    randomGameClicked: false,
  };
  closeRandomGame = () => {
    //сбросить овердохрена всяких фитч, ливнуть из комнаты
    this.props.closeRandomGame();
    this.setState({
      randomGameClicked: false,
    });
  };
  closeOwnGame = () => {
    //сбросить овердохрена всяких фитч, ливнуть из комнаты
    this.props.closeOwnGame();
    this.setState({
      ownGameClicked: false,
    });
  };
  runRandomGame = () => {
    this.props.requestRandomRoom();
    this.setState({
      randomGameClicked: true,
    });
  };
  runOwnGame = () => {
    this.props.requestOwnRoom();
  };
  joinOwnGame = () => {
    this.setState({
      ownGameClicked: true,
    });
    this.props.joinOwnGame();
  };
  handleFocus = (e) => e.target.select();
  showOwnGameForm = () => {
    const {
      ownGame,
      userData,
      setPlayerType,
      setSpectatorType,
      deleteOwnRoom,
    } = this.props;
    const { ownGameClicked, randomGameClicked } = this.state;
    if (ownGame) {
      if (ownGameClicked) {
        return (
          <>
            <span className="game-description">отправьте url друзьям:</span>
            <input
              className="game-input"
              type="text"
              placeholder="комната..."
              readOnly
              value={window.location.href}
              onFocus={this.handleFocus}
            />
            <div className="game-button" onClick={this.closeOwnGame}>
              отмена
            </div>
          </>
        );
      } else {
        return (
          <>
          <span className="game-description">отправьте url друзьям:</span>
            <input
              className="game-input"
              type="text"
              placeholder="комната..."
              readOnly
              value={window.location.href}
              onFocus={this.handleFocus}
            />
            <div className="game-types">
              <div
                className={`game-types__element${
                  userData.userType === 'players'
                    ? ' game-types__element_choosed'
                    : ''
                }`}
                onClick={setPlayerType}
              >
                игрок
              </div>
              <div
                className={`game-types__element${
                  userData.userType === 'spectators'
                    ? ' game-types__element_choosed'
                    : ''
                }`}
                onClick={setSpectatorType}
              >
                зритель
              </div>
            </div>
            <div className="game-button" onClick={this.joinOwnGame}>
              вход
            </div>
            <div className="game-button" onClick={deleteOwnRoom}>
              отмена
            </div>
          </>
        );
      }
    } else if (randomGameClicked) {
      return (
        <div className="game-button" onClick={this.closeRandomGame}>
          отмена
        </div>
      );
    } else {
      return (
        <>
          <div className="game-button" onClick={this.runRandomGame}>
            случайная игра
          </div>
          <div
            className="game-button"
            onClick={this.runOwnGame}
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
        <input className="game-input" type="text" placeholder="твоё имя..." />
        {this.showOwnGameForm()}
      </div>
    );
  }
}
/*
export const NewGameCreator = ({ runGame }) => (
  <div className="new-game-creator">
    <input className="gamer-name" type="text" placeholder="твоё имя..." />
    <div className="game-button" onClick={()=>runGame(true)}>случайная игра</div>
    <div className="game-button" onClick={()=>runGame(false)}>своя игра</div>
  </div>
);
*/

NewGameCreator.propTypes = {
  runGame: PropTypes.func.isRequired,
};

export default NewGameCreator;
