import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      manager: "",
      players: [],
      balance: "",
      value: "",
      message: "",
    };
  }
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager: manager, players: players, balance: balance });
  }
  onEnter = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "waiting on transaction success..." });
    console.log(accounts);
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });
    this.setState({ message: "You have been Entered!" });
  };

  pickWinner = async (event) => {
    event.preventDefault();
    console.log('clicked');
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "wait for transaction success..." });
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    this.setState({ message: "a winner has been picked!" });
  };

  render() {
    web3.eth.getAccounts().then(console.log);

    return (
      <div className="App">
        <h1>Lottery Contract</h1>
        <p>This contract is managed by {this.state.manager}</p>
        <p>
          There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, "ether")}{" "}
          ether!
        </p>
        <hr></hr>

        <form onSubmit={this.onEnter}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            {"  "}

            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            ></input>
          </div>
          {"  "}

          <button>Enter</button>
        </form>
        <hr></hr>
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.pickWinner}>Pick a winner!</button>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
