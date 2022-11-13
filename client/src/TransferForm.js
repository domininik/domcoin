import React from 'react';
import { ethers } from 'ethers';
import { Form, Button, Message } from 'semantic-ui-react';

class TransferForm extends React.Component {
  state = {
    errorMessage: '',
    fromAddress: this.props.signerAddress,
    toAddress: '',
    value: 0
  }

  transfer = async () => {
    this.setState({ errorMessage: '' });

    try {
      await this.props.contract.transferFrom(
        this.state.fromAddress,
        this.state.toAddress,
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
          label='from'
          placeholder='address'
          value={this.state.fromAddress}
          onChange={(e) => this.setState({ fromAddress: e.target.value })}
        />
        <Form.Input
          label='to'
          placeholder='address'
          value={this.state.toAddress}
          onChange={(e) => this.setState({ toAddress: e.target.value })}
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
