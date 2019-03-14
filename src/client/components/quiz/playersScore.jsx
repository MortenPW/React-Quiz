import React from "react";

class PlayersScore extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { players } = this.props;
    const playersList = players.length ? (
      players.map(player => (
        <div>
          <p className="col s6">{player.username}</p>
          <p className="col s6 center-align">{player.score}</p>
        </div>
      ))
    ) : (
      <div>No players yet.</div>
    );

    return (
      <div>
        <div className="card">
          <div className="card-body">
            <div className="card-title center-align">Players</div>
            <div className="playersList question col s12">{playersList}</div>
          </div>
        </div>
        <div className="col s12">
          <button
            className="btn answer leave pink lighten-1"
            onClick={this.props.triggerParentUpdate}
          >
            Leave
          </button>
        </div>
      </div>
    );
  }
}

export default PlayersScore;
