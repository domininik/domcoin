import React from 'react';
import { ethers } from 'ethers';
import Domcoin from './artifacts/contracts/Domcoin.sol/Domcoin.json';
import { Form, Button, Message } from 'semantic-ui-react';

class MintForm extends React.Component {
  state = {
    errorMessage: '',
    address: this.props.signerAddress,
    value: 0
  }

  mint = async () => {
    try {
      await this.props.contract.mint(
        this.state.address,
        ethers.utils.formatUnits(this.state.value, 0)
      );
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  }

  render() {
    return(
      <Form onSubmit={this.mint} error={!!this.state.errorMessage}>
        <Message error header="Error" content={this.state.errorMessage} />
        <Form.Input
          label='address'
          placeholder='address'
          value={this.state.address}
          onChange={(e) => this.setState({ address: e.target.value })}
        />
        <Form.Input
          label='value'
          placeholder='value'
          value={this.state.value}
          onChange={(e) => this.setState({ value: e.target.value })}
        />
        <Button content='Mint' primary />
      </Form>
    )
  }
}

export default MintForm;
