import React from "react";
import { ethers } from "ethers";
import Domcoin from "./artifacts/contracts/Domcoin.sol/Domcoin.json";
import { Container } from "semantic-ui-react";

class App extends React.Component {
  state = {
    name: ''
  }

  componentDidMount() {
    if (typeof window.ethereum !== 'undefined') {
      this.initialize();
    } else {
      console.log("ERROR: web3 provider not available");
    };
  };

  async initialize() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    let contract;

    try {
      const signerAddress = await signer.getAddress();
      const contractAddress = ethers.utils.getContractAddress({
        from: signerAddress,
        nonce: 0
      });
      contract = new ethers.Contract(contractAddress, Domcoin.abi, provider);
    } catch (error) {
      console.log(error);
    }

    const name = await contract.name();

    this.setState({ name: name });
  };

  render() {
    return (
      <Container style={{marginTop: 10}}>
        <p>Name: {this.state.name }</p>
      </Container>
    );
  }
}

export default App;
