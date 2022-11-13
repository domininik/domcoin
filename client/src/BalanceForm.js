import React from 'react';
import { Form, Button, Message, Segment } from 'semantic-ui-react';

class TransferForm extends React.Component {
  state = {
    errorMessage: '',
    address: this.props.signerAddress,
    balance: null
  }

  getBalance = async () => {
    this.setState({ errorMessage: '' });

    try {
      const balance = await this.props.contract.balanceOf(this.state.address);
      this.setState({ balance: balance.toString() });
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  }

  render() {
    return(
      <Form onSubmit={this.getBalance} error={!!this.state.errorMessage}>
        <Message error header="Error" content={this.state.errorMessage} />
        <Form.Input
          label='address'
          placeholder='address'
          value={this.state.address}
          onChange={(e) => this.setState({ address: e.target.value })}
        />
        <Button content='Get balance' />
        {
          this.state.balance ? (
            <Segment textAlign='center'>{ this.state.balance }</Segment>
          ) : null
        }
      </Form>
    )
  }
}

export default TransferForm;
