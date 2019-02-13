import React from 'react';

import PropTypes from 'prop-types';

import './style.css';

class NewGameCreator extends React.Component {
  state = {
    ownGameClicked: false,
    randomGameClicked: false,
    gamerTypeClicked: false,
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
    this.props.runRandomGame();
    this.setState({
      randomGameClicked: true,
    });
  };
  runOwnGame = () => {
    this.props.runOwnGame();
  };
  choosePlayerType = (playerType) => {
    this.props.choosePlayerType(playerType); //TODO: плохое название, смени на gamer
    this.setState({
      ownGameClicked: true,
    });
  };

  showOwnGameForm = () => {
    if (this.props.ownGame) {
      if (this.state.ownGameClicked) {
        return (
          <>
            <input
              className="gamer-name"
              type="text"
              placeholder="комната..."
              readOnly
              value={this.props.roomId}
            />
            <div className="game-button" onClick={this.closeOwnGame}>
              отмена
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className="game-types">
              <div className="game-button" onClick={() => this.choosePlayerType('players')}>
                игрок
              </div>
              <div className="game-button" onClick={() =>this.choosePlayerType('spectators')}>
                зритель
              </div>
            </div>
            <div className="game-button" onClick={this.props.deleteOwnRoom}>
              отмена
            </div>
          </>
        );
      }
    } else if (this.state.randomGameClicked) {
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
            //onClick={() => this.setState({ ownGameClicked: true })}
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
        <input className="gamer-name" type="text" placeholder="твоё имя..." />
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
