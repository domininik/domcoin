import './App.css';
import React from 'react';
import { ethers } from 'ethers';
import Domcoin from './artifacts/contracts/Domcoin.sol/Domcoin.json';
import { Container, Segment, Grid, Form, Button, Divider, Message } from 'semantic-ui-react';
import MintForm from './MintForm';
import BurnForm from './BurnForm';

class App extends React.Component {
  state = {
    totalSupply: 0,
    contract: null,
    signerAddress: '',
    notification: '',
    timestamp: ''
  }

  componentDidMount() {
    if (typeof window.ethereum !== 'undefined') {
      this.initialize();
    } else {
      console.log('ERROR: web3 provider not available');
    };
  };

  async initialize() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    let contract;
    let signerAddress;

    try {
      signerAddress = await signer.getAddress();
      const contractAddress = ethers.utils.getContractAddress({
        from: signerAddress,
        nonce: 0
      });
      contract = new ethers.Contract(contractAddress, Domcoin.abi, signer);
    } catch (error) {
      console.log(error);
    }
    const totalSupply = await contract.totalSupply();

    this.addListeners(contract);

    this.setState({
      contract: contract,
      signerAddress: signerAddress,
      totalSupply: ethers.utils.formatUnits(totalSupply, 0)
    });
  };

  addListeners(contract) {
    contract.on('Transfer', async (from, to, value, event) => {
      const amount = ethers.utils.formatUnits(value, 0);
      const notification = `${amount} coins transferred from ${from} to ${to}`;
      const block = await event.getBlock();
      const timestamp = new Date(block.timestamp * 1000);
      const totalSupply = await contract.totalSupply();

      this.setState({
        notification: notification,
        timestamp: timestamp.toUTCString(),
        totalSupply: ethers.utils.formatUnits(totalSupply, 0)
      });
    });
  }

  render() {
    return (
      <Container style={{marginTop: 10}}>
        <p>Total Supply: {this.state.totalSupply }</p>
        {
          this.state.notification ? (
            <Message positive>
              <Message.Header>New event at {this.state.timestamp}</Message.Header>
              {this.state.notification}
            </Message>
          ) : null
        }
        <Segment placeholder>
          <Grid columns={2} relaxed='very' stackable>
            <Grid.Column>
              {
                this.state.contract ? (
                  <MintForm
                    contract={this.state.contract}
                    signerAddress={this.state.signerAddress}
                  />
                ) : null
              }
            </Grid.Column>
            <Grid.Column verticalAlign='middle'>
              {
                this.state.contract ? (
                  <BurnForm
                    contract={this.state.contract}
                    signerAddress={this.state.signerAddress}
                  />
                ) : null
              }
            </Grid.Column>
          </Grid>
          <Divider vertical>Or</Divider>
        </Segment>
      </Container>
    );
  }
}

export default App;
