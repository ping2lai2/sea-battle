import React from 'react';

import PropTypes from 'prop-types';

import './style.css';

class NewGameCreator extends React.Component {
  handleFocus = e => e.target.select();
  showOwnGameForm = () => {
    const {
      ownGame,
      userData,
      setPlayerType,
      setSpectatorType,
      playersCount,
      spectatorsCount,
      closeOwnGame,
      closeRandomGame,
      requestOwnRoom,
      joinOwnGame,
      requestRandomRoom,
      ownGameSelected,
      randomGameSelected,
    } = this.props;
    if (ownGame) {
      if (ownGameSelected) {
        return (
          <>
            <span className="game-title">выбрана игра с друзьями</span>
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
              >
                {`игроки: ${playersCount}`}
              </div>
              <div
                className={`game-types__element${
                  userData.userType === 'spectators'
                    ? ' game-types__element_choosed'
                    : ''
                }`}
              >
                {`зрители: ${spectatorsCount}`}
              </div>
            </div>
            <div className="game-button" onClick={closeOwnGame}>
              отмена
            </div>
          </>
        );
      } else {
        return (
          <>
            <span className="game-title">выбрана игра с друзьями</span>
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
                disabled={playersCount >= 2}
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
            <div className="game-button" onClick={joinOwnGame}>
              вход
            </div>
            <div className="game-button" onClick={closeOwnGame}>
              отмена
            </div>
          </>
        );
      }
    } else if (randomGameSelected) {
      return (
        <>
          <span className="game-title">
            выбрана игра со случайным противником
          </span>
          <div className="game-button" onClick={closeRandomGame}>
            отмена
          </div>
        </>
      );
    } else {
      return (
        <>
          <span className="game-title">доступные режимы игры:</span>
          <div className="game-button" onClick={requestRandomRoom}>
            случайная игра
          </div>
          <div className="game-button" onClick={requestOwnRoom}>
            своя игра
          </div>
        </>
      );
    }
  };
  render() {
    return (
      <div className="new-game-creator">
        {/*<input className="game-input" type="text" placeholder="твоё имя..." />*/}
        {this.showOwnGameForm()}
      </div>
    );
  }
}

NewGameCreator.propTypes = {
  ownGame: PropTypes.bool,
  userData: PropTypes.object.isRequired,
  setPlayerType: PropTypes.func.isRequired,
  setSpectatorType: PropTypes.func.isRequired,
  playersCount: PropTypes.number,
  spectatorsCount: PropTypes.number,
  closeOwnGame: PropTypes.func.isRequired,
  closeRandomGame: PropTypes.func.isRequired,
  requestOwnRoom: PropTypes.func.isRequired,
  joinOwnGame: PropTypes.func.isRequired,
  requestRandomRoom: PropTypes.func.isRequired,
  ownGameSelected: PropTypes.bool.isRequired,
  randomGameSelected: PropTypes.bool.isRequired,
};

export default NewGameCreator;
