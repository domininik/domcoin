import React from 'react';
import { ethers } from 'ethers';
import { Form, Button, Message } from 'semantic-ui-react';

class TransferForm extends React.Component {
  state = {
    errorMessage: '',
    address: this.props.signerAddress,
    value: 0
  }

  transfer = async () => {
    this.setState({ errorMessage: '' });
    
    try {
      await this.props.contract.transfer(
        this.state.address,
        ethers.utils.formatUnits(this.state.value, 0)
      );
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  }

  render() {
    return(
      <Form onSubmit={this.transfer} error={!!this.state.errorMessage}>
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
        <Button content='Transfer' primary />
      </Form>
    )
  }
}

export default TransferForm;
