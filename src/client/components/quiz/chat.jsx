import React from "react";

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      messages: []
    };
  }

  componentDidMount() {
    const { socket } = this.props;

    this.sendMessage = event => {
      event.preventDefault();

      if (this.state.message.length != 0) {
        socket.emit("send_message", {
          author: "",
          message: this.state.message
        });
        this.setState({ message: "" });
      }
    };

    socket.on("receive_message", function(data) {
      addMessage(data);
    });

    const addMessage = data => {
      this.setState({ messages: [...this.state.messages, data] });
      document.getElementById("scrollToBottom").scrollIntoView(false);
    };
  }

  render() {
    return (
      <form onSubmit={event => this.sendMessage(event)}>
        <div className="card">
          <div className="card-body">
            <div className="card-title center-align">Chat</div>
            <hr />
            <div className="messages">
              {this.state.messages.map(message => {
                return (
                  <div>
                    {message.author}: {message.message}
                  </div>
                );
              })}
              <div id="scrollToBottom" />
            </div>
            <div>
              <hr />
              <input
                type="text"
                placeholder="Message"
                className="form-control"
                value={this.state.message}
                onChange={event =>
                  this.setState({ message: event.target.value })
                }
              />
              <div className="right-align">
                <button
                  type="submit"
                  onClick={this.sendMessage}
                  className="btn btn-primary form-control"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default Chat;
